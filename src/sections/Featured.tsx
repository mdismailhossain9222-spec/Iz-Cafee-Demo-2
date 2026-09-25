import { MENU } from "../data";
import { Link } from "../lib/router";
import MenuCard from "../components/MenuCard";
import { Arrow } from "../components/Icons";
import { Reveal } from "../components/motion-primitives";
import { SectionHeading } from "../components/ui";

const PICKS = MENU.filter((m) => m.bestseller).slice(0, 4);

export default function Featured() {
  return (
    <section id="featured" className="relative bg-espresso-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The Counter"
            title="Baked at dawn,"
            accent="gone by noon"
            className="max-w-xl"
          />
          <Reveal delay={0.2}>
            <Link
              to="/menu"
              className="group inline-flex items-center gap-2 rounded-full border border-cream-200/20 px-6 py-3 text-[13px] text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              View all {MENU.length} items
              <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PICKS.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

