import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { MENU } from "../data";
import { Arrow } from "../components/Icons";
import { AnimatedText, Reveal } from "../components/motion-primitives";

const ITEMS = MENU.filter((m) => m.signature);
const RADIUS = 330;

/**
 * True CSS 3D carousel: panels are placed on the inner face of a cylinder
 * using rotateY(θ) translateZ(r), and the whole ring rotates in 3D space.
 */
export default function Showcase3D() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const reduce = useReducedMotion();
  const step = 360 / ITEMS.length;

  const go = useCallback((dir: number) => setIndex((i) => i + dir), []);

  useEffect(() => {
    if (!auto || reduce) return;
    const t = setInterval(() => go(1), 4200);
    return () => clearInterval(t);
  }, [auto, reduce, go]);

  const active = ITEMS[((index % ITEMS.length) + ITEMS.length) % ITEMS.length];

  return (
    <section
      id="signatures"
      className="relative overflow-hidden bg-espresso-900 py-24 lg:py-36"
      onMouseEnter={() => setAuto(false)}
      onMouseLeave={() => setAuto(true)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 [background:radial-gradient(circle,rgba(198,167,94,.6),transparent_62%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] tracking-[0.36em] text-gold-500 uppercase">
            The Signature Three
          </span>
          <h2 className="font-display mt-5 text-4xl leading-[1.05] font-medium text-cream-50 sm:text-6xl">
            <AnimatedText text="Worth the detour" />
          </h2>
        </Reveal>

        {/* 3D ring */}
        <div className="scene mt-16 h-[26rem] sm:h-[30rem]">
          <motion.div
            className="preserve-3d relative mx-auto h-full w-full"
            animate={{ rotateY: -index * step }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
          >
            {ITEMS.map((item, i) => {
              const angle = i * step;
              const isActive = ((index % ITEMS.length) + ITEMS.length) % ITEMS.length === i;
              return (
                <div
                  key={item.id}
                  className="preserve-3d absolute top-1/2 left-1/2 h-[21rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 sm:h-[25rem] sm:w-[18rem]"
                  style={{ transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)` }}
                >
                  <motion.button
                    onClick={() => setIndex(i)}
                    animate={{
                      scale: isActive ? 1 : 0.86,
                      opacity: isActive ? 1 : 0.42,
                      filter: isActive ? "blur(0px)" : "blur(2px)",
                    }}
                    transition={{ duration: 0.6 }}
                    className="group relative block h-full w-full overflow-hidden rounded-[1.6rem] border border-gold-500/25 text-left shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)]"
                    aria-label={`View ${item.name}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-[10px] tracking-[0.26em] text-gold-400 uppercase">
                        {item.category}
                      </p>
                      <p className="font-display mt-1.5 text-xl leading-tight text-cream-50">
                        {item.name}
                      </p>
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Detail panel */}
        <div className="mx-auto mt-10 max-w-xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
            >
              <p className="text-cream-200/70">{active.notes}</p>
              <p className="font-display mt-4 text-2xl text-gold-400">
                ৳{active.price}
                {active.priceLarge && (
                  <span className="ml-2 text-base text-cream-200/45">
                    / ৳{active.priceLarge} large
                  </span>
                )}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream-200/20 text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <Arrow className="h-4 w-4 rotate-180" />
            </button>
            <div className="flex gap-2">
              {ITEMS.map((it, i) => (
                <button
                  key={it.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to ${it.name}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    ((index % ITEMS.length) + ITEMS.length) % ITEMS.length === i
                      ? "w-8 bg-gold-400"
                      : "w-1.5 bg-cream-200/25"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-cream-200/20 text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <Arrow className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
