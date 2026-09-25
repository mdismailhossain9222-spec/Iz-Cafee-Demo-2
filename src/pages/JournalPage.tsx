import { motion, useScroll, useSpring } from "motion/react";
import { ARTICLES, IMG } from "../data";
import { Link, navigate } from "../lib/router";
import { Arrow, Clock } from "../components/Icons";
import { Layer, Reveal, Tilt } from "../components/motion-primitives";
import { Chip, GoldButton, Ornament, PageHero } from "../components/ui";

/* ---------------- Index ---------------- */

export function JournalPage() {
  const [lead, ...rest] = ARTICLES;

  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title="Notes from"
        accent="the bench"
        copy="Short pieces on lamination, extraction and the small decisions that separate good from forgettable."
        image={IMG.cruffin}
      />

      <section className="bg-espresso-950 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          {/* Lead article */}
          <Reveal>
            <article
              onClick={() => navigate(`/journal/${lead.slug}`)}
              className="group grid cursor-pointer overflow-hidden rounded-[1.6rem] border border-cream-200/10 bg-espresso-900/50 transition-colors duration-500 hover:border-gold-500/40 lg:grid-cols-2"
            >
              <div className="relative h-64 overflow-hidden lg:h-full lg:min-h-[24rem]">
                <img
                  src={lead.image}
                  alt={lead.title}
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 to-transparent" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <div className="flex items-center gap-3">
                  <Chip tone="gold">{lead.category}</Chip>
                  <span className="text-[11px] text-cream-200/40">{lead.date}</span>
                </div>
                <h2 className="font-display mt-5 text-3xl leading-tight text-cream-50 sm:text-4xl">
                  {lead.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-cream-200/60">{lead.excerpt}</p>
                <span className="mt-7 inline-flex items-center gap-2 text-[13px] font-medium text-gold-400">
                  Read the piece
                  <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                </span>
              </div>
            </article>
          </Reveal>

          {/* Grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08}>
                <Tilt className="group h-full" max={8}>
                  <article
                    onClick={() => navigate(`/journal/${a.slug}`)}
                    className="preserve-3d flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-cream-200/10 bg-espresso-900/60 transition-colors duration-500 group-hover:border-gold-500/40"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1.3s] group-hover:scale-[1.1]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso-900 to-transparent" />
                    </div>
                    <Layer z={24} className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-2">
                        <Chip>{a.category}</Chip>
                        <span className="inline-flex items-center gap-1 text-[10px] text-cream-200/35">
                          <Clock className="h-3 w-3" />
                          {a.readMins} min
                        </span>
                      </div>
                      <h3 className="font-display mt-4 text-xl leading-snug text-cream-50">{a.title}</h3>
                      <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-cream-200/55">
                        {a.excerpt}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 border-t border-cream-200/10 pt-4 text-[12px] text-gold-400">
                        Read
                        <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Layer>
                  </article>
                </Tilt>
              </Reveal>
            ))}
          </div>

          <Ornament className="mt-20" />
        </div>
      </section>
    </>
  );
}

/* ---------------- Article ---------------- */

export function ArticlePage({ slug }: { slug?: string }) {
  const article = ARTICLES.find((a) => a.slug === slug);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  if (!article) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-5 pt-32 text-center">
        <div>
          <h1 className="font-display text-4xl text-cream-50">Piece not found</h1>
          <p className="mt-3 text-cream-200/55">That article may have been moved.</p>
          <Link to="/journal" className="mt-8 inline-block">
            <GoldButton as="span">
              Back to the journal
              <Arrow className="h-4 w-4" />
            </GoldButton>
          </Link>
        </div>
      </div>
    );
  }

  const others = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <>
      {/* Reading progress */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[58] h-[3px] origin-left bg-gradient-to-r from-gold-500 to-gold-300"
      />

      <article className="bg-espresso-950 pt-32 pb-24 lg:pt-40">
        <div className="mx-auto max-w-3xl px-5 lg:px-10">
          <Reveal>
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 text-[12px] text-cream-200/50 transition-colors hover:text-gold-400"
            >
              <Arrow className="h-3.5 w-3.5 rotate-180" />
              The Journal
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Chip tone="gold">{article.category}</Chip>
              <span className="text-[12px] text-cream-200/40">{article.date}</span>
              <span className="inline-flex items-center gap-1 text-[12px] text-cream-200/40">
                <Clock className="h-3.5 w-3.5" />
                {article.readMins} min read
              </span>
            </div>
            <h1 className="font-display mt-5 text-4xl leading-[1.08] font-medium text-cream-50 sm:text-5xl">
              {article.title}
            </h1>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 max-w-5xl px-5 lg:px-10">
            <div className="overflow-hidden rounded-2xl border border-cream-200/10">
              <img src={article.image} alt={article.title} className="h-[22rem] w-full object-cover sm:h-[28rem]" />
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 max-w-2xl px-5 lg:px-10">
          {article.body.map((p, i) => (
            <Reveal key={i} delay={0.03 * i}>
              <p
                className={
                  i === 0
                    ? "text-[19px] leading-[1.75] text-cream-100 first-letter:font-display first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:text-6xl first-letter:leading-none first-letter:text-gold-400"
                    : "mt-6 text-[16px] leading-[1.85] text-cream-200/70"
                }
              >
                {p}
              </p>
            </Reveal>
          ))}

          <Ornament className="mt-16" />
        </div>

        {/* Next reads */}
        <div className="mx-auto mt-20 max-w-5xl px-5 lg:px-10">
          <h2 className="font-display text-2xl text-cream-50">Keep reading</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {others.map((a) => (
              <article
                key={a.slug}
                onClick={() => navigate(`/journal/${a.slug}`)}
                className="group flex cursor-pointer gap-4 rounded-xl border border-cream-200/10 bg-espresso-900/50 p-4 transition-colors hover:border-gold-500/35"
              >
                <img src={a.image} alt="" aria-hidden className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                <div>
                  <p className="text-[10px] tracking-[0.18em] text-gold-500/80 uppercase">{a.category}</p>
                  <h3 className="font-display mt-1 text-[16px] leading-snug text-cream-50">{a.title}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-[12px] text-gold-400">
                    Read
                    <Arrow className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
