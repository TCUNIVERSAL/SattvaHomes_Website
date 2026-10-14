"""
Traces the Sattva Homes logo artwork into vector pieces, so it stays sharp at any size and can be
assembled piece by piece in the intro.

    python -I scripts/make-logo.py

Reads content_to_use/logo/sattva-homes-logo.png and writes:
  - src/assets/brand/sattva-logo.svg   the static logo (header and footer)
  - index.html                         the animated intro logo, between the logo:start/logo:end markers

Each pixel is split into gold and ink coverage (the artwork is two colours on white), enlarged so
thin parts such as the ladder survive, then each piece is traced on its own with potrace. Pieces
are picked out by where they sit in the artwork (see `piece_for`), and their order in the build-up
is set in `PIECES`. Needs `pip install potracer opencv-python-headless pillow`; re-runnable.
"""
import re
from pathlib import Path

import cv2
import numpy as np
import potrace
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'content_to_use' / 'logo' / 'sattva-homes-logo.png'
STATIC_SVG = ROOT / 'src' / 'assets' / 'brand' / 'sattva-logo.svg'
INDEX = ROOT / 'index.html'

# The rules either side of HOMES are hairlines (about 0.7 px in the source), too fine to trace:
# drawn as 1 px lines at any size instead. (x1, x2, y) in source px, measured from the artwork.
RULES = {'sl-line-left': (81, 181.6, 500.3), 'sl-line-right': (516, 616.6, 500.3)}

GOLD = '#C69221'
INK = '#231F1C'
SCALE = 4  # trace at 4x the source size: smoother curves, and 1 px lines stay solid

# Construction order. Each entry: class names, colour, start (s), and for groups the stagger (s).
# Foundation first, then walls, roof, window, the crew, the name, its rules, then HOMES.
PIECES = [
    ('sl-foundation', 0.00),
    ('sl-wall-left', 0.30),
    ('sl-wall-right', 0.38),
    ('sl-roof-left', 0.66),
    ('sl-roof-right', 0.74),
    ('sl-pane-1', 1.20), ('sl-pane-2', 1.248), ('sl-pane-3', 1.296), ('sl-pane-4', 1.344),
    ('sl-crew-kneeling', 1.34), ('sl-crew-ladder', 1.42), ('sl-crew-bucket', 1.50),
    ('sl-crew-painter', 1.54), ('sl-crew-carpenter', 1.66),
    ('sl-letter-1', 1.86), ('sl-letter-2', 1.914), ('sl-letter-3', 1.968),
    ('sl-letter-4', 2.022), ('sl-letter-5', 2.076), ('sl-letter-6', 2.13),
    ('sl-line-left', 2.30), ('sl-line-right', 2.30),
    ('sl-homes-1', 2.34), ('sl-homes-2', 2.376), ('sl-homes-3', 2.412), ('sl-homes-4', 2.448), ('sl-homes-5', 2.484),
]


def coverage(path):
    """Gold and ink coverage (0-1) per pixel, at SCALE x the source size."""
    im = Image.open(path).convert('RGBA')
    im = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    rgb = a[..., :3] * (a[..., 3:] / 255) + 255 * (1 - a[..., 3:] / 255)
    white = np.array([255, 255, 255], np.float32)
    basis = np.stack([np.array([198, 146, 33], np.float32) - white, np.array([35, 31, 28], np.float32) - white], axis=1)
    mix, *_ = np.linalg.lstsq(basis, (rgb - white).reshape(-1, 3).T, rcond=None)
    gold, ink = (np.clip(m.reshape(rgb.shape[:2]), 0, 1) for m in mix)
    return gold, ink


def roof_underside(x):
    """y of the right roof's underside at x (source px), from its apex down to the eave."""
    return 172 + (x - 349) * (88 / 109) + 18


def piece_for(colour, x, y):
    """Which piece a blob belongs to, from its centre (source px). None means ignore."""
    if colour == 'gold':
        if 333 <= x <= 364 and 225 <= y <= 256:
            return f"sl-pane-{1 + (x >= 348) + 2 * (y >= 241)}"
        if 470 <= y <= 520:  # HOMES; the rules either side are drawn as hairlines (see RULES)
            return None if x < 200 or x > 500 else f"sl-homes-{1 + sum(x >= edge for edge in (265, 330, 395, 445))}"
        if 430 <= y <= 450:  # the gold bars in the two As
            return 'sl-letter-2' if x < 300 else 'sl-letter-6'
        if 425 <= x <= 500 and 310 <= y <= 325:  # the bench top: built with its carpenter
            return 'sl-crew-carpenter'
    else:
        if 385 <= y <= 466:
            return f"sl-letter-{1 + sum(x >= edge for edge in (150, 255, 340, 430, 530))}"
        if 315 <= x <= 335 and y >= 340:
            return 'sl-crew-bucket'
        if x < 232:
            return 'sl-crew-kneeling'
        if x < 300:
            return 'sl-crew-ladder'
        if x < 400:
            return 'sl-crew-painter'
        return 'sl-crew-carpenter'
    return None


def split(gold, ink):
    """Masks per piece, at SCALE."""
    h, w = gold.shape
    ys, xs = np.mgrid[0:h, 0:w] / SCALE
    # Ink a little lower, so the thinnest parts (ladder rails, roller handle) stay joined.
    g, k = gold > 0.5, ink > 0.4
    masks = {}

    def add(name, mask):
        masks[name] = masks.get(name, np.zeros_like(mask)) | mask

    # The house frame is drawn in one piece in the artwork; cut it along its joints.
    frame_g = g & (ys >= 168) & (ys <= 370) & (xs >= 150) & (xs <= 545) & ~((xs >= 425) & (ys >= 300) & (ys < 354.5))
    frame_g &= ~((xs >= 333) & (xs <= 364) & (ys >= 225) & (ys <= 256))
    foundation = frame_g & (ys >= 354.5)
    wall_l = frame_g & (ys < 354.5) & (xs >= 290) & (xs <= 307) & (ys >= 226)
    roof_l = frame_g & (ys < 300) & ~wall_l & ~foundation
    for name, m in (('sl-foundation', foundation), ('sl-wall-left', wall_l), ('sl-roof-left', roof_l)):
        add(name, m)
    g &= ~(foundation | wall_l | roof_l)

    wall_r = k & (xs >= 407) & (xs <= 423) & (ys >= 185) & (ys < 357)
    roof_r = k & ~wall_r & (xs >= 345) & (xs <= 465) & (ys >= 168) & (ys < roof_underside(xs))
    add('sl-wall-right', wall_r)
    add('sl-roof-right', roof_r)
    k &= ~(wall_r | roof_r)

    for colour, m in (('gold', g), ('ink', k)):
        n, labels, stats, centres = cv2.connectedComponentsWithStats(m.astype(np.uint8), connectivity=8)
        for i in range(1, n):
            if stats[i, cv2.CC_STAT_AREA] < 4 * SCALE:  # speckle
                continue
            cx, cy = centres[i] / SCALE
            name = piece_for(colour, cx, cy)
            if name is None:
                if not (470 <= cy <= 520):
                    print(f'  unassigned {colour} blob at {cx:.0f},{cy:.0f}')
                continue
            add(f'{name}|{colour}', labels == i)
    # Fold the frame pieces' colour into the key too.
    for name, colour in (('sl-foundation', 'gold'), ('sl-wall-left', 'gold'), ('sl-roof-left', 'gold'), ('sl-wall-right', 'ink'), ('sl-roof-right', 'ink')):
        masks[f'{name}|{colour}'] = masks.pop(name)
    return masks


def trace(mask):
    """SVG path data for a mask, in source px."""
    ys, xs = np.nonzero(mask)
    y0, x0 = max(ys.min() - 2, 0), max(xs.min() - 2, 0)
    crop = mask[y0 : ys.max() + 3, x0 : xs.max() + 3]
    # potracer reads its input as an image: dark (0) pixels are the shape.
    curves = potrace.Bitmap(~crop).trace(turdsize=2, alphamax=1.0, opticurve=True, opttolerance=0.2)
    # Points in tenths of a source px; written relative to the previous point to keep the file small.
    tenths = lambda p: (round((p.x + x0) / SCALE * 10), round((p.y + y0) / SCALE * 10))
    num = lambda v: (f'{v / 10:g}'.replace('0.', '.', 1) if abs(v) < 10 else f'{v / 10:g}')
    out = []
    for curve in curves:
        here = tenths(curve.start_point)
        out.append(f'M{num(here[0])} {num(here[1])}')
        for seg in curve.segments:
            points = [seg.c, seg.end_point] if seg.is_corner else [seg.c1, seg.c2, seg.end_point]
            pts = [tenths(p) for p in points]
            if seg.is_corner:
                for pt in pts:
                    out.append(f'l{num(pt[0] - here[0])} {num(pt[1] - here[1])}')
                    here = pt
            else:
                out.append('c' + ' '.join(f'{num(pt[0] - here[0])} {num(pt[1] - here[1])}' for pt in pts))
                here = pts[-1]
        out.append('z')
    # Tidy: no space before a minus sign.
    return re.sub(r' -', '-', ''.join(out))


def main():
    gold, ink = coverage(SOURCE)
    masks = split(gold, ink)
    order = {name: i for i, (name, _) in enumerate(PIECES)}
    missing = [name for name, _ in PIECES if name not in RULES and not any(key.startswith(name + '|') for key in masks)]
    if missing:
        raise SystemExit(f'No artwork found for: {missing}')

    every = np.zeros_like(gold, bool)
    for m in masks.values():
        every |= m
    ys, xs = np.nonzero(every)
    pad = 3
    box = (xs.min() / SCALE - pad, ys.min() / SCALE - pad, (xs.max() - xs.min()) / SCALE + 2 * pad, (ys.max() - ys.min()) / SCALE + 2 * pad)
    view_box = ' '.join(f'{v:.0f}' for v in box)

    # Pieces in build order; a piece with both colours (an A, the bench) becomes a group.
    by_piece = {}
    for key in sorted(masks, key=lambda k: order[k.split('|')[0]]):
        name, colour = key.split('|')
        by_piece.setdefault(name, []).append((GOLD if colour == 'gold' else INK, trace(masks[key])))

    for name, (x1, x2, y) in RULES.items():
        by_piece[name] = f'<path stroke="{GOLD}" stroke-width="1" vector-effect="non-scaling-stroke" d="M{x1} {y}H{x2}"/>'

    animated, static = [], []
    for name, delay in PIECES:
        parts = by_piece[name]
        paths = parts if isinstance(parts, str) else ''.join(f'<path fill="{c}" d="{d}"/>' for c, d in parts)
        static.append(paths)
        animated.append(f'<g class="sl-piece {name}" style="--delay:{delay:.3f}s">{paths}</g>')

    STATIC_SVG.write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}" fill-rule="evenodd">'
        f'<title>Sattva Homes</title>{"".join(static)}</svg>\n'
    )
    svg = (
        f'<svg class="sattva-logo sl-new logo-animate" viewBox="{view_box}" fill-rule="evenodd" aria-hidden="true" focusable="false">\n'
        + '\n'.join(animated)
        + '\n</svg>'
    )
    html = INDEX.read_text()
    html, n = re.subn(r'(<!-- logo:start -->).*?(<!-- logo:end -->)', lambda m: f'{m[1]}{svg}{m[2]}', html, flags=re.S)
    if n != 1:
        raise SystemExit('index.html needs exactly one <!-- logo:start --><!-- logo:end --> pair')
    INDEX.write_text(html)
    print(f'{len(by_piece)} pieces, viewBox {view_box}, static SVG {STATIC_SVG.stat().st_size / 1024:.1f} KB')


if __name__ == '__main__':
    main()
