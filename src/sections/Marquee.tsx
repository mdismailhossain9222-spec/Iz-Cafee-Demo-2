import { MARQUEE } from "../data";
import { Spark } from "../components/Icons";

/** 3D-rotated infinite ticker — the track is tilted on X so it reads as a
 *  physical band receding into the page. */
export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="scene-near relative z-20 -mt-px border-y border-gold-500/20 bg-espresso-900/60 py-5">
      <div
        className="preserve-3d flex overflow-hidden"
        style={{ transform: "rotateX(14deg)" }}
      >
        <div className="marquee-track flex shrink-0 items-center gap-10 pr-10 whitespace-nowrap">
          {items.map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="font-display text-xl tracking-wide text-cream-200/85 italic sm:text-2xl">
                {t}
              </span>
              <Spark className="h-4 w-4 shrink-0 text-gold-500/70" />
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="marquee-track flex shrink-0 items-center gap-10 pr-10 whitespace-nowrap"
        >
          {items.map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="font-display text-xl tracking-wide text-cream-200/85 italic sm:text-2xl">
                {t}
              </span>
              <Spark className="h-4 w-4 shrink-0 text-gold-500/70" />
            </span>
          ))}
        </div>
      </div>

      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-espresso-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-espresso-950 to-transparent" />
    </div>
  );
}

