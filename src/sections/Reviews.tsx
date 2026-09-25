import { BRAND, REVIEWS } from "../data";
import { Star } from "../components/Icons";
import { AnimatedText, Reveal, Tilt } from "../components/motion-primitives";

export default function Reviews() {
  return (
    <section className="relative bg-espresso-900 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-3">
            <span className="flex gap-1 text-gold-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4" />
              ))}
            </span>
            <span className="text-[12px] tracking-[0.18em] text-cream-200/60 uppercase">
              {BRAND.rating} · {BRAND.reviewCount} reviews
            </span>
          </div>
          <h2 className="font-display max-w-2xl text-4xl leading-[1.05] font-medium text-cream-50 sm:text-5xl">
            <AnimatedText text="What Dhaka says" />
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.1}>
              <Tilt className="group h-full" max={7}>
                <figure className="preserve-3d flex h-full flex-col rounded-2xl border border-cream-200/10 bg-espresso-950/60 p-7 transition-colors duration-500 group-hover:border-gold-500/35">
                  <span className="font-display text-4xl leading-none text-gold-500/40">“</span>
                  <blockquote className="font-display mt-3 flex-1 text-lg leading-relaxed text-cream-100 italic">
                    {r.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-cream-200/10 pt-5">
                    <span className="font-display grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-gold-300 to-gold-600 text-sm text-espresso-950">
                      {r.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-[13px] text-cream-100">{r.name}</p>
                      <p className="text-[11px] text-cream-200/45">{r.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

