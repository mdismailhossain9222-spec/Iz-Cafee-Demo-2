import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import hero from "../assets/interior.jpg?inline";
import { BRAND } from "../data";
import { Arrow, Pin, Star } from "../components/Icons";
import { AnimatedChars, AnimatedText, Magnetic } from "../components/motion-primitives";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Scroll-driven depth
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.22]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Pointer-driven 3D parallax
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cfg = { stiffness: 90, damping: 22, mass: 0.7 };
  const rotY = useSpring(useTransform(px, [0, 1], [7, -7]), cfg);
  const rotX = useSpring(useTransform(py, [0, 1], [-5, 5]), cfg);
  const farX = useSpring(useTransform(px, [0, 1], [26, -26]), cfg);
  const midX = useSpring(useTransform(px, [0, 1], [-42, 42]), cfg);

  function onMove(e: React.MouseEvent) {
    if (reduce) return;
    px.set(e.clientX / window.innerWidth);
    py.set(e.clientY / window.innerHeight);
  }

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="scene grain relative min-h-[100svh] overflow-hidden"
    >
      {/* Layer 1 — photograph */}
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <motion.img
          src={hero}
          alt="The warm walnut, brass and fluted-glass interior of IZ Pâtisserie & Café in Dhaka"
          fetchPriority="high"
          decoding="async"
          style={reduce ? undefined : { x: farX }}
          className="h-full w-full scale-110 object-cover object-center"
        />
      </motion.div>

      {/* Layer 2 — cinematic grading.
          The headline sits left, but this room's warmth (pendants, banquette,
          pastry case) lives centre-right — so the left is held dark for
          legibility while the right stays open and glowing. */}
      <div className="absolute inset-0 bg-gradient-to-r from-espresso-950 via-espresso-950/82 to-espresso-950/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-transparent to-espresso-950/55" />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_62%_48%,transparent_45%,rgba(14,9,6,.55)_100%)]" />
      {/* Warm bloom lifted from the pendant lights */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45 mix-blend-screen [background:radial-gradient(ellipse_at_68%_38%,rgba(224,200,138,.28),transparent_55%)]"
      />

      {/* Layer 3 — rotating gold halo */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { x: midX }}
        className="pointer-events-none absolute -top-40 -right-40 h-[38rem] w-[38rem]"
      >
        <div className="spin-slow h-full w-full rounded-full opacity-25 [background:conic-gradient(from_0deg,transparent,rgba(198,167,94,.55),transparent_55%)] blur-3xl" />
      </motion.div>

      {/* Layer 4 — steam wisps */}
      {!reduce && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2">
          {[18, 34, 52, 68, 84].map((left, i) => (
            <span
              key={left}
              className="absolute bottom-24 w-px rounded-full bg-gradient-to-t from-transparent via-cream-200/40 to-transparent"
              style={{
                left: `${left}%`,
                height: `${90 + i * 22}px`,
                animation: `steam ${7 + i * 1.4}s ease-in-out ${i * 1.1}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <motion.div
        style={{ y: copyY, opacity: fade }}
        className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pt-28 pb-28 lg:px-10"
      >
        <motion.div
          className="preserve-3d max-w-3xl"
          style={reduce ? undefined : { rotateX: rotX, rotateY: rotY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mb-7 inline-flex items-center gap-3 rounded-full border border-gold-500/30 bg-espresso-900/50 px-4 py-2 backdrop-blur-sm"
            style={{ transform: "translateZ(50px)" }}
          >
            <span className="flex gap-0.5 text-gold-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3" />
              ))}
            </span>
            <span className="text-[11px] tracking-[0.18em] text-cream-200/85 uppercase">
              {BRAND.rating} · {BRAND.reviewCount} reviews
            </span>
          </motion.div>

          <h1
            className="font-display text-[3.1rem] leading-[0.94] font-medium tracking-[-0.02em] text-cream-50 sm:text-7xl lg:text-[6.5rem]"
            style={{ transform: "translateZ(90px)" }}
          >
            <AnimatedText text="Escape the" delay={0.25} />
            <br />
            <span className="foil italic">
              <AnimatedText text="ordinary." delay={0.5} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.95 }}
            className="mt-8 max-w-lg text-[17px] leading-relaxed text-cream-200/75"
            style={{ transform: "translateZ(40px)" }}
          >
            Seventy-two layers of butter-laminated pastry, single-origin espresso pulled to the
            second, and three ateliers across Dhaka built for lingering.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ transform: "translateZ(60px)" }}
          >
            <Magnetic>
              <a
                href="#grab"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 px-8 py-4 text-sm font-semibold text-espresso-950 shadow-[0_14px_44px_-12px_rgba(198,167,94,.8)]"
              >
                Order with IZ Grab
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href="#locations"
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-cream-200/25 px-8 py-4 text-sm text-cream-100 backdrop-blur-sm transition-colors hover:border-gold-400/60 hover:bg-cream-200/5"
              >
                <Pin className="h-4 w-4" />
                Find a branch
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-5 flex items-center gap-4 lg:left-10"
        >
          <AnimatedChars
            text="SCROLL"
            className="text-[10px] tracking-[0.42em] text-cream-200/45"
          />
          <motion.span
            animate={{ scaleY: [0.25, 1, 0.25], originY: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="block h-10 w-px bg-gradient-to-b from-gold-400 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
