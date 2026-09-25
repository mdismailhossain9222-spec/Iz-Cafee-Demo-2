import { ARTICLES } from "../data";
import { Link, navigate } from "../lib/router";
import { Arrow, Clock } from "../components/Icons";
import { Reveal } from "../components/motion-primitives";
import { Chip, SectionHeading } from "../components/ui";

export default function JournalPreview() {
  const picks = ARTICLES.slice(0, 3);

  return (
    <section className="bg-espresso-900 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="The Journal" title="Notes from the bench" className="max-w-xl" />
          <Reveal delay={0.15}>
            <Link
              to="/journal"
              className="group inline-flex items-center gap-2 rounded-full border border-cream-200/20 px-6 py-3 text-[13px] text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              All pieces
              <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {picks.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.09}>
              <article
                onClick={() => navigate(`/journal/${a.slug}`)}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-cream-200/10 bg-espresso-950/50 transition-colors duration-500 hover:border-gold-500/40"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.3s] group-hover:scale-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <Chip>{a.category}</Chip>
                    <span className="inline-flex items-center gap-1 text-[10px] text-cream-200/35">
                      <Clock className="h-3 w-3" />
                      {a.readMins} min
                    </span>
                  </div>
                  <h3 className="font-display mt-4 text-lg leading-snug text-cream-50">{a.title}</h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-cream-200/55">{a.excerpt}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
