import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import barista from "../assets/barista.jpg?inline";
import counter from "../assets/hero.jpg?inline";
import { CRAFT_STATS } from "../data";
import { AnimatedText, Layer, Reveal, Tilt } from "../components/motion-primitives";
import { Clock, Leaf, Spark } from "../components/Icons";

const PILLARS = [
  { icon: Leaf, title: "Sourced close", body: "Single-origin beans cupped in-house, rotated each season." },
  { icon: Clock, title: "Slow proofed", body: "Doughs rest 18 hours cold before they ever see an oven." },
  { icon: Spark, title: "Finished to order", body: "Bomboloni are filled the moment you order, never before." },
];

export default function Craft() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const yA = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section id="craft" ref={ref} className="relative overflow-hidden bg-espresso-900 py-24 lg:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:gap-20 lg:px-10">
        {/* Stacked 3D image pair */}
        <div className="scene relative h-[30rem] sm:h-[34rem]">
          <motion.div style={{ y: yA }} className="absolute top-0 left-0 w-[68%]">
            <Tilt max={9} className="group">
              <div className="preserve-3d overflow-hidden rounded-2xl border border-gold-500/20 shadow-[0_50px_90px_-40px_rgba(0,0,0,.95)]">
                <img
                  src={counter}
                  alt="Laminated pastries and a cappuccino on the marble counter at IZ"
                  loading="lazy"
                  decoding="async"
                  className="h-[20rem] w-full object-cover sm:h-[23rem]"
                />
              </div>
            </Tilt>
          </motion.div>

          <motion.div style={{ y: yB }} className="absolute right-0 bottom-0 w-[58%]">
            <Tilt max={11} className="group">
              <div className="preserve-3d overflow-hidden rounded-2xl border border-gold-500/25 shadow-[0_50px_90px_-35px_rgba(0,0,0,1)]">
                <img
                  src={barista}
                  alt="Barista pouring microfoam to finish latte art"
                  loading="lazy"
                  decoding="async"
                  className="h-[17rem] w-full object-cover sm:h-[20rem]"
                />
              </div>
            </Tilt>
          </motion.div>

          {/* Floating gold seal */}
          <div className="float-y absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="scene">
              <div className="preserve-3d grid h-24 w-24 place-items-center rounded-full border border-gold-400/50 bg-espresso-950/85 backdrop-blur-md">
                <Layer z={22} className="text-center">
                  <p className="font-display text-xl leading-none text-gold-300">72</p>
                  <p className="mt-1 text-[8px] tracking-[0.2em] text-cream-200/60 uppercase">
                    layers
                  </p>
                </Layer>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Reveal>
            <span className="text-[11px] tracking-[0.36em] text-gold-500 uppercase">Our Craft</span>
            <h2 className="font-display mt-5 text-4xl leading-[1.05] font-medium text-cream-50 sm:text-6xl">
              <AnimatedText text="Patience," />
              <br />
              <span className="text-gold-400 italic">
                <AnimatedText text="then butter" delay={0.15} />
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-7 leading-relaxed text-cream-200/70">
              Every laminated dough at IZ is folded by hand, rested overnight, and baked in small
              batches through the morning. Nothing is held over. When the tray is empty, it is empty —
              which is why the 8 AM shelf looks nothing like the 4 PM one.
            </p>
            <p className="mt-4 leading-relaxed text-cream-200/70">
              The coffee programme runs on the same logic: a tight menu, dialled every morning
              against the day's humidity, pulled by baristas who taste before they serve.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={0.1 * i}>
                <div className="rounded-xl border border-cream-200/10 bg-espresso-950/40 p-5 transition-colors hover:border-gold-500/35">
                  <p.icon className="h-5 w-5 text-gold-400" />
                  <h3 className="font-display mt-3 text-base text-cream-50">{p.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-cream-200/55">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-cream-200/10 pt-8">
            {CRAFT_STATS.map((s, i) => (
              <Reveal key={s.label} delay={0.08 * i}>
                <p className="font-display text-3xl text-gold-400 sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-[10px] tracking-[0.18em] text-cream-200/50 uppercase">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
