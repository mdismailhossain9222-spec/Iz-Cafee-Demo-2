import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BRANCHES, FAQS, IMG } from "../data";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";
import { Arrow, Clock, Phone, Pin } from "../components/Icons";
import { Reveal } from "../components/motion-primitives";
import { Chip, GoldButton, PageHero, SectionHeading } from "../components/ui";

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Find Us"
        title="Three ateliers,"
        accent="one standard"
        copy="Each room is built for something slightly different. Here is which one to pick, and what to expect when you arrive."
        image={IMG.counter}
      />
      <BranchList />
      <Faq />
    </>
  );
}

function BranchList() {
  return (
    <section className="bg-espresso-950 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl space-y-8 px-5 lg:px-10">
        {BRANCHES.map((b, i) => (
          <Reveal key={b.id} delay={i * 0.06}>
            <article
              className={cn(
                "group grid overflow-hidden rounded-[1.6rem] border border-cream-200/10 bg-espresso-900/50 transition-colors duration-500 hover:border-gold-500/35 lg:grid-cols-2",
                i % 2 === 1 && "lg:[direction:rtl]",
              )}
            >
              <div className="relative h-64 overflow-hidden lg:h-full lg:min-h-[22rem]">
                <img
                  src={b.image}
                  alt={`IZ ${b.area} branch`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-transparent to-transparent" />
                {b.flagship && (
                  <span className="absolute top-5 left-5 rounded-full border border-gold-400/50 bg-espresso-950/80 px-3 py-1.5 text-[9px] tracking-[0.2em] text-gold-300 uppercase backdrop-blur-sm">
                    Flagship
                  </span>
                )}
              </div>

              <div className="p-7 [direction:ltr] sm:p-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Pin className="h-5 w-5 text-gold-400" />
                    <h2 className="font-display mt-3 text-3xl text-cream-50 sm:text-4xl">{b.area}</h2>
                  </div>
                  <span className="shrink-0 text-right">
                    <span className="font-display block text-2xl text-gold-400/80">{b.seats}</span>
                    <span className="text-[10px] tracking-[0.16em] text-cream-200/40 uppercase">seats</span>
                  </span>
                </div>

                <p className="mt-4 text-[14px] leading-relaxed text-cream-200/60">{b.note}</p>

                <div className="mt-6 space-y-2.5 border-t border-cream-200/10 pt-5 text-[13px]">
                  <p className="flex gap-2.5 text-cream-200/60">
                    <Pin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70" />
                    {b.address}
                  </p>
                  <a
                    href={`tel:${b.phone}`}
                    className="flex items-center gap-2.5 text-cream-200/80 transition-colors hover:text-gold-400"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-gold-500/70" />
                    {b.phoneDisplay}
                  </a>
                  <p className="flex items-center gap-2.5 text-cream-200/60">
                    <Clock className="h-4 w-4 shrink-0 text-gold-500/70" />
                    {b.hours}
                  </p>
                </div>

                <div className="mt-6">
                  <p className="text-[10px] tracking-[0.2em] text-gold-500/70 uppercase">Best for</p>
                  <p className="mt-1.5 text-[14px] text-cream-100">{b.bestFor}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {b.amenities.map((a) => (
                    <Chip key={a}>{a}</Chip>
                  ))}
                  <Chip tone="gold">Since {b.opened}</Chip>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={b.maps} target="_blank" rel="noopener noreferrer external">
                    <GoldButton as="span">
                      Open in Maps
                      <Arrow className="h-4 w-4" />
                    </GoldButton>
                  </a>
                  <Link
                    to="/reserve"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-200/22 px-7 py-3.5 text-[14px] text-cream-100 transition-colors hover:border-gold-400/70 hover:bg-cream-200/5"
                  >
                    Reserve here
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-espresso-900 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-5 lg:px-10">
        <SectionHeading eyebrow="Good to know" title="Questions we get" center />

        <div className="mt-14 divide-y divide-cream-200/8 border-y border-cream-200/8">
          {FAQS.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cn(
                    "font-display text-lg transition-colors sm:text-xl",
                    open === i ? "text-gold-300" : "text-cream-100",
                  )}
                >
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-cream-200/18 text-cream-200/70"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pr-12 pb-6 text-[14px] leading-relaxed text-cream-200/60">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

