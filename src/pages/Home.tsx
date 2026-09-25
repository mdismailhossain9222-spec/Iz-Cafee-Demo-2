import { BRANCHES } from "../data";
import { Link } from "../lib/router";
import Hero from "../sections/Hero";
import Marquee from "../sections/Marquee";
import Featured from "../sections/Featured";
import Showcase3D from "../sections/Showcase3D";
import Craft from "../sections/Craft";
import Locations from "../sections/Locations";
import Reviews from "../sections/Reviews";
import JournalPreview from "../sections/JournalPreview";
import { Arrow, Clock, Phone } from "../components/Icons";
import { AnimatedText, Reveal } from "../components/motion-primitives";
import { GoldButton } from "../components/ui";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <TodayStrip />
      <Featured />
      <Showcase3D />
      <Craft />
      <Locations />
      <Reviews />
      <JournalPreview />
      <ClosingCta />
    </>
  );
}

/** Live "open now" strip — computed from the shared 8am–11pm schedule. */
function TodayStrip() {
  const now = new Date();
  const h = now.getHours();
  const open = h >= 8 && h < 23;

  return (
    <section className="border-b border-cream-200/8 bg-espresso-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 sm:flex-row lg:px-10">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            {open && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                open ? "bg-emerald-400" : "bg-cream-200/35"
              }`}
            />
          </span>
          <p className="text-[13px] text-cream-200/75">
            {open ? "Open now" : "Currently closed"} ·{" "}
            <span className="text-cream-200/45">All branches 8:00 AM – 11:00 PM daily</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {BRANCHES.map((b) => (
            <a
              key={b.id}
              href={`tel:${b.phone}`}
              className="inline-flex items-center gap-1.5 text-[12px] text-cream-200/55 transition-colors hover:text-gold-400"
            >
              <Phone className="h-3 w-3" />
              {b.area}
            </a>
          ))}
          <Link
            to="/reserve"
            className="inline-flex items-center gap-1.5 text-[12px] text-gold-400 hover:text-gold-300"
          >
            <Clock className="h-3 w-3" />
            Reserve
          </Link>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-espresso-950 py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] [background:radial-gradient(circle,rgba(198,167,94,.7),transparent_65%)] blur-3xl"
      />
      <div className="relative mx-auto max-w-2xl px-5 text-center">
        <h2 className="font-display text-4xl leading-[1.05] font-medium text-cream-50 sm:text-6xl">
          <AnimatedText text="A table," />{" "}
          <span className="foil italic">
            <AnimatedText text="or a box to go" delay={0.15} />
          </span>
        </h2>
        <Reveal delay={0.25}>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-cream-200/65">
            Whichever you choose, it was folded by hand this morning.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/reserve">
              <GoldButton as="span">
                Reserve a table
                <Arrow className="h-4 w-4" />
              </GoldButton>
            </Link>
            <Link
              to="/order"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-200/22 px-7 py-3.5 text-[14px] text-cream-100 transition-colors hover:border-gold-400/70 hover:bg-cream-200/5"
            >
              Order with IZ Grab
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

