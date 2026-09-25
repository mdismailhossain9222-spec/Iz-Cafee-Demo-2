import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { BRANCHES, BRAND } from "../data";
import { useCart } from "../lib/cart";
import { Link, useRoute } from "../lib/router";
import { cn } from "../utils/cn";
import { Arrow, Bag, Phone } from "../components/Icons";
import { Magnetic } from "../components/motion-primitives";

export const NAV_LINKS = [
  { label: "Menu", to: "/menu" },
  { label: "Our Craft", to: "/craft" },
  { label: "Locations", to: "/locations" },
  { label: "Journal", to: "/journal" },
  { label: "Reserve", to: "/reserve" },
];

export default function Nav({ onOpenCart }: { onOpenCart: () => void }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const route = useRoute();
  const { count } = useCart();

  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  const onHome = route.path === "/";
  const opaque = solid || !onHome || open;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600"
      />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          opaque
            ? "border-b border-gold-500/15 bg-espresso-950/85 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <Link to="/" className="group flex items-center gap-3" aria-label={`${BRAND.name} home`}>
            <span className="relative grid h-10 w-10 place-items-center">
              <span className="absolute inset-0 rounded-full border border-gold-500/40 transition-transform duration-700 group-hover:rotate-180" />
              <img src="/logo.png" alt="Logo" class="h-10 w-auto object-contain brightness-0 invert" />
            </span>
            <span className="hidden sm:block">
              <span className="font-display block text-[15px] leading-tight font-semibold tracking-wide text-cream-100">
                Pâtisserie &amp; Café
              </span>
              <span className="block text-[10px] tracking-[0.3em] text-gold-500/70 uppercase">
                {BRAND.tagline}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => {
              const active = route.path === l.to || route.path.startsWith(l.to + "/");
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "group relative text-[13px] font-medium tracking-wide transition-colors",
                    active ? "text-gold-300" : "text-cream-200/70 hover:text-cream-50",
                  )}
                >
                  {l.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-gold-400"
                    />
                  ) : (
                    <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-400/60 transition-all duration-300 group-hover:w-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${BRANCHES[0].phone}`}
              className="hidden items-center gap-2 rounded-full border border-cream-200/15 px-4 py-2.5 text-[12px] text-cream-200/80 transition-colors hover:border-gold-500/50 hover:text-cream-50 xl:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" />
              {BRANCHES[0].phoneDisplay}
            </a>

            <button
              onClick={onOpenCart}
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-cream-200/15 text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <Bag className="h-4 w-4" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-semibold text-espresso-950"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Magnetic strength={0.22}>
              <Link
                to="/order"
                className="group hidden items-center gap-2 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 px-5 py-2.5 text-[13px] font-semibold text-espresso-950 shadow-[0_8px_30px_-8px_rgba(198,167,94,.7)] sm:inline-flex"
              >
                Order
                <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full border border-cream-200/15 text-cream-100 lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                {open ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-gold-500/15 lg:hidden"
            >
              <div className="flex flex-col px-5 py-5">
                {[...NAV_LINKS, { label: "IZ Club", to: "/club" }, { label: "Order", to: "/order" }].map(
                  (l, i) => (
                    <motion.div
                      key={l.to}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i }}
                    >
                      <Link
                        to={l.to}
                        onNavigate={() => setOpen(false)}
                        className="font-display flex items-center justify-between border-b border-cream-200/8 py-3.5 text-xl text-cream-100"
                      >
                        {l.label}
                        <Arrow className="h-4 w-4 text-gold-500/60" />
                      </Link>
                    </motion.div>
                  ),
                )}
                <a
                  href={`tel:${BRANCHES[0].phone}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm text-gold-400"
                >
                  <Phone className="h-4 w-4" /> {BRANCHES[0].phoneDisplay}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

