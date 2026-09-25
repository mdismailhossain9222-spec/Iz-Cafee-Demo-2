import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CRAFT_STATS, IMG, PROCESS, TEAM, TIMELINE } from "../data";
import { Link } from "../lib/router";
import { Arrow, Clock, Leaf, Spark } from "../components/Icons";
import { AnimatedText, Layer, Reveal, Tilt } from "../components/motion-primitives";
import { GoldButton, Ornament, PageHero, SectionHeading } from "../components/ui";

export default function CraftPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Craft"
        title="Patience,"
        accent="then butter"
        copy="Everything we sell tomorrow is decided today. This is the long, inconvenient way to make pastry — and the only way we know that works."
        image={IMG.barista}
      />

      <Philosophy />
      <Process />
      <Timeline />
      <Team />
      <CraftCta />
    </>
  );
}

/* ---------------- Philosophy ---------------- */

function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["9%", "-9%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-espresso-900 py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div className="scene relative h-[30rem] sm:h-[34rem]">
          <motion.div style={{ y: yA }} className="absolute top-0 left-0 w-[68%]">
            <Tilt max={9} className="group">
              <div className="preserve-3d overflow-hidden rounded-2xl border border-gold-500/20 shadow-[0_50px_90px_-40px_rgba(0,0,0,.95)]">
                <img
                  src={IMG.counter}
                  alt="Laminated pastries and a cappuccino on the marble counter at IZ"
                  loading="lazy"
                  className="h-[20rem] w-full object-cover sm:h-[23rem]"
                />
              </div>
            </Tilt>
          </motion.div>
          <motion.div style={{ y: yB }} className="absolute right-0 bottom-0 w-[58%]">
            <Tilt max={11} className="group">
              <div className="preserve-3d overflow-hidden rounded-2xl border border-gold-500/25 shadow-[0_50px_90px_-35px_rgba(0,0,0,1)]">
                <img
                  src={IMG.cruffin}
                  alt="A sugar-dusted cruffin showing its laminated spiral"
                  loading="lazy"
                  className="h-[17rem] w-full object-cover sm:h-[20rem]"
                />
              </div>
            </Tilt>
          </motion.div>

          <div className="float-y absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="scene">
              <div className="preserve-3d grid h-24 w-24 place-items-center rounded-full border border-gold-400/50 bg-espresso-950/85 backdrop-blur-md">
                <Layer z={22} className="text-center">
                  <p className="font-display text-xl leading-none text-gold-300">72</p>
                  <p className="mt-1 text-[8px] tracking-[0.2em] text-cream-200/60 uppercase">layers</p>
                </Layer>
              </div>
            </div>
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Philosophy" title="Three folds," accent="no shortcuts" />
          <Reveal delay={0.2}>
            <p className="mt-7 leading-relaxed text-cream-200/70">
              A croissant is alternating sheets of butter and dough, folded until the layers are thin
              enough to steam apart in the oven. Three book folds give seventy-two layers — enough for
              a true honeycomb, few enough that the butter never merges into the dough.
            </p>
            <p className="mt-4 leading-relaxed text-cream-200/70">
              The coffee programme runs on the same logic: a tight menu, dialled every morning against
              the day's humidity, pulled by baristas who taste before they serve.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { icon: Leaf, title: "Sourced close", body: "Single-origin beans cupped in-house, rotated each season." },
              { icon: Clock, title: "Slow proofed", body: "Doughs rest 18 hours cold before they see an oven." },
              { icon: Spark, title: "Finished to order", body: "Bomboloni are filled the moment you order." },
            ].map((p, i) => (
              <Reveal key={p.title} delay={0.08 * i}>
                <div className="h-full rounded-xl border border-cream-200/10 bg-espresso-950/40 p-5 transition-colors hover:border-gold-500/35">
                  <p.icon className="h-5 w-5 text-gold-400" />
                  <h3 className="font-display mt-3 text-base text-cream-50">{p.title}</h3>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-cream-200/55">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-cream-200/10 pt-8">
            {CRAFT_STATS.map((s, i) => (
              <Reveal key={s.label} delay={0.07 * i}>
                <p className="font-display text-3xl text-gold-400 sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-[10px] tracking-[0.18em] text-cream-200/50 uppercase">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */

function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.4"] });

  return (
    <section ref={ref} className="relative bg-espresso-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <SectionHeading eyebrow="The Process" title="Five steps, every morning" center />

        <div className="relative mt-16">
          {/* Progress spine */}
          <div className="absolute top-0 bottom-0 left-[1.45rem] w-px bg-cream-200/10 lg:left-1/2" />
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute top-0 bottom-0 left-[1.45rem] w-px origin-top bg-gradient-to-b from-gold-300 to-gold-600 lg:left-1/2"
          />

          <div className="space-y-10">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={0.05 * i}>
                <div
                  className={`relative flex gap-6 lg:w-1/2 ${
                    i % 2 === 0 ? "lg:ml-auto lg:flex-row lg:pl-12" : "lg:flex-row-reverse lg:pr-12 lg:text-right"
                  }`}
                >
                  <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-500/40 bg-espresso-950 lg:absolute lg:top-0 lg:-translate-y-0 lg:[--off:-1.5rem]"
                    style={i % 2 === 0 ? { left: "-1.5rem" } : { right: "-1.5rem" }}
                  >
                    <span className="font-display text-sm text-gold-400">{p.step}</span>
                  </span>
                  <div className="flex-1 rounded-xl border border-cream-200/10 bg-espresso-900/50 p-6 transition-colors hover:border-gold-500/30">
                    <h3 className="font-display text-xl text-cream-50">{p.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-cream-200/55">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Timeline ---------------- */

function Timeline() {
  return (
    <section className="relative overflow-hidden bg-espresso-900 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <SectionHeading eyebrow="Our Story" title="From one deck oven" accent="to three rooms" center />

        <div className="scrollbar-none mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.06}>
              <Tilt className="group h-full w-[17rem] shrink-0 snap-start sm:w-[19rem]" max={8}>
                <article className="preserve-3d flex h-full flex-col rounded-2xl border border-cream-200/10 bg-espresso-950/60 p-7 transition-colors duration-500 group-hover:border-gold-500/40">
                  <Layer z={26}>
                    <span className="font-display text-4xl text-gold-400/85">{t.year}</span>
                    <h3 className="font-display mt-4 text-xl leading-snug text-cream-50">{t.title}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-cream-200/55">{t.body}</p>
                  </Layer>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-cream-200/30">Scroll sideways →</p>
      </div>
    </section>
  );
}

/* ---------------- Team ---------------- */

function Team() {
  return (
    <section className="bg-espresso-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <SectionHeading eyebrow="The People" title="Who actually" accent="folds the dough" center />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1}>
              <Tilt className="group h-full" max={8}>
                <figure className="preserve-3d relative h-full overflow-hidden rounded-2xl border border-cream-200/10 bg-espresso-900/60 transition-colors duration-500 group-hover:border-gold-500/40">
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.3s] group-hover:scale-[1.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso-900 via-espresso-900/20 to-transparent" />
                  </div>
                  <figcaption className="p-6">
                    <h3 className="font-display text-xl text-cream-50">{m.name}</h3>
                    <p className="mt-1 text-[11px] tracking-[0.18em] text-gold-500/85 uppercase">{m.role}</p>
                    <p className="mt-3 text-[13px] leading-relaxed text-cream-200/55">{m.bio}</p>
                  </figcaption>
                </figure>
              </Tilt>
            </Reveal>
          ))}
        </div>
        <Ornament className="mt-20" />
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */

function CraftCta() {
  return (
    <section className="relative overflow-hidden bg-espresso-900 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 [background:radial-gradient(circle,rgba(198,167,94,.6),transparent_65%)] blur-3xl"
      />
      <div className="relative mx-auto max-w-2xl px-5 text-center">
        <h2 className="font-display text-3xl leading-tight font-medium text-cream-50 sm:text-5xl">
          <AnimatedText text="Come taste the difference" />
        </h2>
        <p className="mt-5 text-cream-200/65">
          Read more from the bench in our journal, or reserve a table and let us walk you through it.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/journal">
            <GoldButton as="span">
              Read the journal
              <Arrow className="h-4 w-4" />
            </GoldButton>
          </Link>
          <Link
            to="/reserve"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-200/22 px-7 py-3.5 text-[14px] text-cream-100 transition-colors hover:border-gold-400/70 hover:bg-cream-200/5"
          >
            Reserve a table
          </Link>
        </div>
      </div>
    </section>
  );
}

