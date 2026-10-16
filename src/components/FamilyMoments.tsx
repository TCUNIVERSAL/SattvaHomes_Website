import together from '../assets/images/family-together.webp'
import grow from '../assets/images/family-grow.webp'
import home from '../assets/images/family-home.webp'

// Stacked and tilted on phones; pinned to a 3:2 board from `sm` up. Class strings stay literal so Tailwind sees them.
const moments = [
  {
    caption: 'Together',
    src: together,
    alt: 'A mother, father and young son cooking together at a sunlit kitchen island.',
    place: 'self-start -rotate-3 sm:left-[3%] sm:top-[2%] sm:-rotate-[4deg]',
  },
  {
    caption: 'Grow',
    src: grow,
    alt: 'A father marking his young son’s height on a door frame while the mother looks on, smiling.',
    place: 'self-end mt-4 rotate-2 sm:left-[32.5%] sm:top-[24%] sm:mt-0 sm:rotate-[3deg]',
  },
  {
    caption: 'Home',
    src: home,
    alt: 'A family eating pizza on the floor of their new living room among moving boxes, the house keys on a bench, as the sun sets outside.',
    place: 'self-start mt-4 -rotate-2 sm:left-[62%] sm:top-[46%] sm:mt-0 sm:-rotate-[3deg]',
  },
]

export function FamilyMoments() {
  return (
    <section aria-labelledby="family-title" className="relative px-4 pb-16 sm:px-6 md:pb-24 lg:px-12">
      {/* Panel colour is the board the photos are pinned to */}
      <div className="reveal mx-auto grid max-w-[1340px] items-center overflow-clip rounded-[36px] bg-[#efdcc7] shadow-[0_40px_80px_-50px_rgb(31_43_66/.3)] lg:grid-cols-[1.15fr_1fr]">
        {/* Container units keep the captions in proportion with the polaroids at any width */}
        <div className="flex flex-col gap-0 px-7 py-10 [container-type:inline-size] sm:relative sm:block sm:aspect-[3/2] sm:p-0">
          <svg
            aria-hidden="true"
            viewBox="0 0 300 200"
            fill="none"
            className="absolute inset-0 hidden size-full text-bronze-deep/70 sm:block"
          >
            <g stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 5" strokeLinecap="round">
              <path d="M112 40 C 138 26, 156 34, 151 52" />
              <path d="M203 84 C 226 70, 244 76, 240 96" />
            </g>
          </svg>

          {moments.map(({ caption, src, alt, place }) => (
            <figure
              key={caption}
              className={`${place} relative w-[72%] bg-[#fffdf9] p-[4%] pb-0 shadow-[0_18px_30px_-14px_rgb(31_43_66/.4),0_2px_6px_rgb(31_43_66/.1)] transition-[rotate,scale] duration-500 ease-[var(--ease-expo)] hover:z-10 hover:rotate-0 hover:scale-[1.03] sm:absolute sm:w-[35%]`}
            >
              {/* Pin */}
              <span
                aria-hidden="true"
                className="absolute -top-[2.4%] left-1/2 z-10 size-[7%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#e2c79d,var(--color-bronze)_55%,#86663f)] shadow-[0_3px_5px_rgb(31_43_66/.35)]"
              />
              <img
                src={src}
                alt={alt}
                width={900}
                height={675}
                loading="lazy"
                decoding="async"
                className="block aspect-[4/3] w-full object-cover"
              />
              <figcaption className="py-[7%] text-center font-serif text-[5.4cqw] italic leading-none text-ink sm:text-[2.9cqw]">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="px-7 pb-12 sm:px-12 lg:py-14 lg:pl-6 lg:pr-16">
          {/* Darker bronze than the eyebrow default: it needs 4.5:1 on sand */}
          <h2 id="family-title" className="eyebrow text-[#6e5333]!">
            After the keys
          </h2>
          <figure className="mt-5">
            <blockquote className="font-serif text-[clamp(1.85rem,1.2rem+1.5vw,2.75rem)] leading-[1.14] tracking-[-0.015em] text-ink">
              <p>
                “When we hand over the keys, it shouldn’t feel like a new house. It should feel like <em className="text-bronze-deep">home.</em>”
              </p>
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-3 text-[11px] font-bold tracking-[.22em] text-ink">
              <span aria-hidden="true" className="h-px w-8 bg-bronze" />
              THE SATTVA PROMISE
            </figcaption>
          </figure>
          <p className="mt-7 max-w-[420px] text-[17px] leading-relaxed text-ink-soft">
            Room to be together. Space to grow. A place that feels like yours from the very first night.
          </p>
        </div>
      </div>
    </section>
  )
}
