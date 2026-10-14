"""
Downloads each home design's brochure PDF and saves just its floor plan, one WebP image per storey.

    python -I scripts/make-floorplans.py                    # all designs
    python -I scripts/make-floorplans.py birchfield harvest # just the named slugs
    python -I scripts/make-floorplans.py --force            # re-render images that already exist

PDFs are saved untouched in content_to_use/brochures/ (kept out of the app). Images go to
public/floorplans/<slug>-1.webp (ground floor) and <slug>-2.webp (first floor), and their sizes to
src/data/floorplans.ts. Downloaded PDFs are reused, so it is safe to re-run. Slugs, storeys and
brochure paths are read from src/data/designs.ts.

Each brochure is one sheet (a few have a second page): title and area table, the plan (one drawing
per storey) and facade photos. The plan is found from the picture itself: walls are long straight
lines, while photos are dense with colour and mid-tones and the header is text and a table.
Brochures with no plan get no image and are listed at the end.
"""
import re
import sys
import time
import urllib.request
from pathlib import Path

import cv2
import numpy as np
import pypdfium2 as pdfium
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDF_DIR = ROOT / 'content_to_use' / 'brochures'
OUT_DIR = ROOT / 'public' / 'floorplans'
UPLOADS = 'https://sattva.com.au/wp-content/uploads/'
LONGEST_SIDE = 1800  # px; room labels stay readable when enlarged, files stay light
DETECT_SCALE = 4     # render scale used to find the plan


def catalogue():
    src = (ROOT / 'src' / 'data' / 'designs.ts').read_text(encoding='utf8')
    # ['slug', 'Name', 'series', storeys, ..., 'image path', 'brochure path'],
    pattern = r"^\s*\['([a-z0-9-]+)', '[^']*', '[a-z]+', ([12]),.*?'(\d{4}/\d{2}/[^']+\.pdf)'\],?$"
    for match in re.finditer(pattern, src, re.M):
        yield match.group(1), int(match.group(2)), match.group(3)


def fetch(url, dest):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (floor plan import)'})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    if not data.startswith(b'%PDF'):
        raise ValueError('not a PDF')
    dest.write_bytes(data)


def to_bgr(page, scale):
    return cv2.cvtColor(np.array(page.render(scale=scale).to_pil().convert('RGB')), cv2.COLOR_RGB2BGR)


def area(b):
    return (b[2] - b[0]) * (b[3] - b[1])


def union(boxes):
    return (min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes))


def find_plan(img):
    """Returns (boxes, big_photos, lines): a tight box per drawing found, a mask of photos, and the drawn lines."""
    h, w = img.shape[:2]
    m = min(h, w)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # Photo-like pixels: coloured, or mid-tone grey. Where they are dense, it's a photo or a coloured band.
    tone = ((hsv[:, :, 1] > 40) & (hsv[:, :, 2] > 40)) | ((gray > 70) & (gray < 225))
    k = max(31, (m // 40) | 1)
    photo = (cv2.blur(tone.astype(np.float32), (k, k)) > 0.45).astype(np.uint8)
    photo = cv2.dilate(photo, np.ones((k, k), np.uint8))

    # Only the large photo areas count. Small ones are furniture drawn inside the plan.
    n, labels, stats, _ = cv2.connectedComponentsWithStats(photo, 8)
    big_photos = np.zeros_like(photo)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] > 0.03 * h * w:
            big_photos[labels == i] = 1
    # Dark shapes lying largely inside a photo (tree silhouettes, roofs, shadows) belong to it too.
    # A plan's walls merely touching a coloured page band don't.
    dark_all = (gray < 130).astype(np.uint8)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(dark_all, 8)
    inside = np.bincount(labels[(big_photos > 0) & (dark_all > 0)], minlength=n)
    share = inside / np.maximum(stats[:, cv2.CC_STAT_AREA], 1)
    share[0] = 0
    big_photos = (big_photos.astype(bool) | (share > 0.35)[labels]).astype(np.uint8)

    # Plans are the only part of the sheet with many long horizontal AND vertical lines
    # (text has neither; the area table has only horizontals). Doors leave gaps, so the line
    # map is thickened until each storey's drawing becomes one blob.
    dark = (dark_all & (big_photos == 0)).astype(np.uint8)
    length = max(25, m // 60)
    horiz = cv2.morphologyEx(dark, cv2.MORPH_OPEN, np.ones((1, length), np.uint8))
    vert = cv2.morphologyEx(dark, cv2.MORPH_OPEN, np.ones((length, 1), np.uint8))
    # Outer walls are much longer than any letter, so the edges come from these alone;
    # that keeps nearby titles and spec tables out even when they join the blob.
    wall = m // 12
    wall_h = cv2.morphologyEx(dark, cv2.MORPH_OPEN, np.ones((1, wall), np.uint8))
    wall_v = cv2.morphologyEx(dark, cv2.MORPH_OPEN, np.ones((wall, 1), np.uint8))
    # Every line of the drawings (walls, windows, outlines), for telling storeys apart.
    walls = horiz | vert
    blob = cv2.dilate(horiz | vert, np.ones((m // 22, m // 22), np.uint8))
    n, labels, stats, _ = cv2.connectedComponentsWithStats(blob, 8)
    boxes = []
    for i in range(1, n):
        x, y, bw, bh, _area = stats[i]
        if bw < m * 0.07 or bh < m * 0.07:
            continue  # (narrow-lot plans are only about 8% of the sheet wide)
        own = labels[y:y + bh, x:x + bw] == i
        own_h = wall_h[y:y + bh, x:x + bw] & own
        own_v = wall_v[y:y + bh, x:x + bw] & own
        # Walls run both ways (a table only one way, text neither). Narrow-lot homes have
        # short cross walls, so it's the total that has to be large.
        if own_h.sum() + own_v.sum() < 3 * wall or not own_h.any() or not own_v.any():
            continue
        ys, xs = np.nonzero(own_h | own_v)
        boxes.append((x + xs.min(), y + ys.min(), x + xs.max(), y + ys.max()))
    if not boxes:
        return [], big_photos, walls
    # Keep the drawings: the largest box, plus any close to its size (the other storey).
    largest = max(area(b) for b in boxes)
    return [b for b in boxes if area(b) >= 0.25 * largest], big_photos, walls


def split(box, lines, m):
    """Splits one box holding two storeys. Each storey is one connected drawing once door gaps are
    closed, and the two drawings stand apart; returns the two largest, or the box unchanged."""
    x0, y0, x1, y1 = box
    region = cv2.morphologyEx(lines[y0:y1 + 1, x0:x1 + 1], cv2.MORPH_CLOSE, np.ones((m // 80, m // 80), np.uint8))
    n, _, stats, _ = cv2.connectedComponentsWithStats(region, 8)
    parts = sorted(
        ((x0 + x, y0 + y, x0 + x + bw, y0 + y + bh) for x, y, bw, bh, _a in stats[1:]),
        key=area,
        reverse=True,
    )
    if len(parts) < 2 or area(parts[1]) < 0.25 * area(parts[0]):
        return [box]
    first, second = parts[0], parts[1]
    # Two storeys sit side by side or one above the other; they don't overlap much.
    ox = max(0, min(first[2], second[2]) - max(first[0], second[0]))
    oy = max(0, min(first[3], second[3]) - max(first[1], second[1]))
    if ox * oy > 0.15 * area(second):
        return [box]
    # Smaller separate pieces (a carport, a deck) join the nearer storey.
    groups = [[first], [second]]
    centre = lambda b: ((b[0] + b[2]) / 2, (b[1] + b[3]) / 2)
    for extra in parts[2:]:
        if area(extra) < 0.02 * area(first):
            continue  # labels and specks
        cx, cy = centre(extra)
        nearer = min((0, 1), key=lambda g: (centre(groups[g][0])[0] - cx) ** 2 + (centre(groups[g][0])[1] - cy) ** 2)
        groups[nearer].append(extra)
    return [union(groups[0]), union(groups[1])]


def floors(boxes, storeys, walls, m):
    """One box per storey, ground floor first."""
    if storeys == 1:
        return [union(boxes)]
    if len(boxes) == 1:
        boxes = split(boxes[0], walls, m)
        if len(boxes) == 1:
            return boxes  # couldn't separate them: one image with both floors
    boxes = sorted(boxes, key=area, reverse=True)
    groups = [[boxes[0]], [boxes[1]]]
    centre = lambda b: ((b[0] + b[2]) / 2, (b[1] + b[3]) / 2)
    for extra in boxes[2:]:  # a carport or deck drawn apart: join the nearer storey
        cx, cy = centre(extra)
        nearer = min((0, 1), key=lambda g: (centre(groups[g][0])[0] - cx) ** 2 + (centre(groups[g][0])[1] - cy) ** 2)
        groups[nearer].append(extra)
    a, b = union(groups[0]), union(groups[1])
    # The ground floor carries the garage, so it's usually the bigger drawing; when they're
    # about the same size, brochures put the ground floor first (left, or top).
    if area(b) > area(a) * 1.1 or (abs(area(a) - area(b)) <= area(a) * 0.1 and (b[0], b[1]) < (a[0], a[1])):
        a, b = b, a
    return [a, b]


def render(pdf_path, slug, storeys):
    """Writes <slug>-1.webp (ground floor) and <slug>-2.webp (first floor). Returns the image sizes."""
    pdf = pdfium.PdfDocument(str(pdf_path))
    # Usually one page, but a few brochures have a blank first page: use the first page with a plan.
    for index in range(len(pdf)):
        page = pdf[index]
        small = to_bgr(page, DETECT_SCALE)
        boxes, big_photos, walls = find_plan(small)
        if boxes:
            break
    if not boxes:
        return []  # no plan in this brochure; the site offers to send it instead

    h, w = small.shape[:2]
    m = min(h, w)
    pad = round(m * 0.025)  # room for labels just outside the walls ("PORTICO", "sliding door")
    parts = floors(boxes, storeys, walls, m)
    sizes = []
    for n, part in enumerate(parts, 1):
        x0, y0 = max(part[0] - pad, 0), max(part[1] - pad, 0)
        x1, y1 = min(part[2] + pad, w), min(part[3] + pad, h)
        # Render again at the scale that makes this floor LONGEST_SIDE px, so it stays crisp.
        factor = min(LONGEST_SIDE / max(x1 - x0, y1 - y0), 3.0)
        img = to_bgr(page, DETECT_SCALE * factor)
        sx, sy = img.shape[1] / w, img.shape[0] / h
        X0, Y0, X1, Y1 = round(x0 * sx), round(y0 * sy), round(x1 * sx), round(y1 * sy)
        crop = img[Y0:Y1, X0:X1].copy()
        # Paint out the edges of photos, and of the other storey, that the padding reached into.
        mask = cv2.resize(big_photos, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_NEAREST)
        blank = mask[Y0:Y1, X0:X1] > 0
        for other in parts:
            if other is part:
                continue
            ox0, oy0 = round(other[0] * sx) - X0, round(other[1] * sy) - Y0
            ox1, oy1 = round(other[2] * sx) - X0, round(other[3] * sy) - Y0
            blank[max(oy0, 0):max(oy1, 0), max(ox0, 0):max(ox1, 0)] = True
        crop[blank] = 255

        image = Image.fromarray(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))
        if max(image.size) > LONGEST_SIDE:
            ratio = LONGEST_SIDE / max(image.size)
            image = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.LANCZOS)
        image.save(OUT_DIR / f'{slug}-{n}.webp', 'WEBP', quality=84, method=6)
        sizes.append(image.size)
    return sizes


def write_manifest():
    # slug -> one [width, height] per floor (ground first), so pages can reserve space before images load.
    by_slug = {}
    for path in sorted(OUT_DIR.glob('*-[0-9].webp')):
        slug, n = path.stem.rsplit('-', 1)
        with Image.open(path) as im:
            by_slug.setdefault(slug, {})[int(n)] = (im.width, im.height)
    lines = ['// Generated by scripts/make-floorplans.py: floor-plan image sizes (px) per design, one entry per',
             '// floor, ground floor first. The images live in public/floorplans/<slug>-<floor>.webp.',
             'export const floorplanSizes: Record<string, [number, number][]> = {']
    for slug, by_floor in by_slug.items():
        sizes = ', '.join(f'[{w}, {h}]' for _, (w, h) in sorted(by_floor.items()))
        lines.append(f"  '{slug}': [{sizes}],")
    lines.append('}')
    (ROOT / 'src' / 'data' / 'floorplans.ts').write_text('\n'.join(lines) + '\n', encoding='utf8')


def main():
    args = sys.argv[1:]
    force = '--force' in args
    wanted = {a for a in args if not a.startswith('--')}
    PDF_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    items = [(s, st, p) for s, st, p in catalogue() if not wanted or s in wanted]
    if not items:
        sys.exit('No matching designs found.')
    failures, missing, joined = [], [], []
    for i, (slug, storeys, path) in enumerate(items, 1):
        pdf_path = PDF_DIR / f'{slug}.pdf'
        try:
            if not pdf_path.exists():
                fetch(UPLOADS + path, pdf_path)
                time.sleep(0.25)  # be gentle with the old site
            if force or not (OUT_DIR / f'{slug}-1.webp').exists():
                stale = [OUT_DIR / f'{slug}.webp', *OUT_DIR.glob(f'{slug}-[0-9].webp')]
                for old in stale:
                    old.unlink(missing_ok=True)  # includes single images from earlier versions
                sizes = render(pdf_path, slug, storeys)
                if not sizes:
                    missing.append(slug)
                    note = 'no floor plan in this brochure'
                else:
                    note = ', '.join(f'{w}x{h}' for w, h in sizes)
                    if storeys == 2 and len(sizes) == 1:
                        joined.append(slug)
                        note += ' (both floors in one image)'
            else:
                note = 'already there'
            print(f'[{i}/{len(items)}] {slug}: {note}', flush=True)
        except Exception as error:  # keep going; report at the end
            failures.append((slug, str(error)))
            print(f'[{i}/{len(items)}] {slug}: FAILED {error}', flush=True)
    write_manifest()
    print(f'\nDone: {len(items) - len(failures)} ok, {len(failures)} failed')
    for slug, error in failures:
        print(f'  failed  {slug}: {error}')
    for slug in missing:
        print(f'  no plan {slug}: brochure has no floor plan; check by hand')
    for slug in joined:
        print(f'  joined  {slug}: double storey, floors not separated')


main()
