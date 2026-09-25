import { motion } from "motion/react";
import { BRANCHES } from "../data";
import { Arrow, Clock, Phone, Pin } from "../components/Icons";
import { AnimatedText, Layer, Reveal, Tilt } from "../components/motion-primitives";

/**
 * The live site only ever described the Gulshan 2 branch (and in structured
 * data, with a placeholder phone number). All three real branches are here,
 * each with its verified address and dialable number.
 */
export default function Locations() {
  return (
    <section id="locations" className="relative bg-espresso-950 py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] tracking-[0.36em] text-gold-500 uppercase">Find Us</span>
          <h2 className="font-display mt-5 text-4xl leading-[1.05] font-medium text-cream-50 sm:text-6xl">
            <AnimatedText text="Three ateliers" />
            <br />
            <span className="text-gold-400 italic">
              <AnimatedText text="across Dhaka" delay={0.15} />
            </span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {BRANCHES.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.1}>
              <Tilt className="group h-full" max={8}>
                <article className="preserve-3d relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream-200/10 bg-gradient-to-b from-espresso-900/90 to-espresso-950 p-7 transition-colors duration-500 group-hover:border-gold-500/40">
                  {b.flagship && (
                    <span className="absolute top-5 right-5 rounded-full border border-gold-400/40 px-2.5 py-1 text-[9px] tracking-[0.2em] text-gold-300 uppercase">
                      Flagship
                    </span>
                  )}

                  <Layer z={30}>
                    <Pin className="h-6 w-6 text-gold-400" />
                    <h3 className="font-display mt-4 text-2xl text-cream-50">{b.area}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-cream-200/60">{b.address}</p>
                  </Layer>

                  <Layer z={18} className="mt-6 space-y-2.5 border-t border-cream-200/10 pt-5">
                    <a
                      href={`tel:${b.phone}`}
                      className="flex items-center gap-2.5 text-[13px] text-cream-200/80 transition-colors hover:text-gold-400"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-gold-500/70" />
                      {b.phoneDisplay}
                    </a>
                    <p className="flex items-center gap-2.5 text-[13px] text-cream-200/60">
                      <Clock className="h-4 w-4 shrink-0 text-gold-500/70" />
                      {b.hours}
                    </p>
                  </Layer>

                  <Layer z={26} className="mt-auto pt-6">
                    <motion.a
                      href={b.maps}
                      target="_blank"
                      rel="noopener noreferrer external"
                      whileHover={{ x: 4 }}
                      className="inline-flex items-center gap-2 text-[13px] font-medium text-gold-400"
                    >
                      Open in Maps
                      <Arrow className="h-3.5 w-3.5" />
                    </motion.a>
                  </Layer>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

