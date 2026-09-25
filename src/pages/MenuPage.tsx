import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  CATEGORIES,
  DIET_LABEL,
  MENU,
  type Category,
  type Diet,
  type MenuItem,
} from "../data";
import { useCart } from "../lib/cart";
import { useToast } from "../lib/toast";
import { sanitizeText } from "../lib/security";
import { cn } from "../utils/cn";
import MenuCard, { DietLegend } from "../components/MenuCard";
import { Arrow, Spark } from "../components/Icons";
import { Reveal } from "../components/motion-primitives";
import { Chip, GoldButton, Ornament, PageHero } from "../components/ui";
import { IMG } from "../data";

type Tab = "All" | Category;

export default function MenuPage() {
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [diets, setDiets] = useState<Diet[]>([]);
  const [detail, setDetail] = useState<MenuItem | null>(null);

  const results = useMemo(() => {
    const q = sanitizeText(query, 60).toLowerCase();
    return MENU.filter((m) => {
      if (tab !== "All" && m.category !== tab) return false;
      if (diets.length && !diets.every((d) => m.diet.includes(d))) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.notes.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    });
  }, [tab, query, diets]);

  const grouped = useMemo(() => {
    const map = new Map<Category, MenuItem[]>();
    results.forEach((m) => {
      map.set(m.category, [...(map.get(m.category) ?? []), m]);
    });
    return [...map.entries()];
  }, [results]);

  function toggleDiet(d: Diet) {
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  const filtersActive = tab !== "All" || query !== "" || diets.length > 0;

  return (
    <>
      <PageHero
        eyebrow="The Full Menu"
        title="Everything on"
        accent="the counter"
        copy="Twenty-two items, baked and poured across three Dhaka ateliers. Filter by category or dietary preference — every item is tagged."
        image={IMG.brunch}
      >
        <div className="mt-8">
          <DietLegend />
        </div>
      </PageHero>

      {/* Sticky filter bar */}
      <div className="sticky top-[68px] z-40 border-b border-cream-200/8 bg-espresso-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-4 lg:px-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <LayoutGroup id="menu-tabs">
              <div className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                {(["All", ...CATEGORIES] as Tab[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setTab(c)}
                    className={cn(
                      "relative shrink-0 rounded-full px-4 py-2 text-[12px] font-medium whitespace-nowrap transition-colors",
                      tab === c ? "text-espresso-950" : "text-cream-200/65 hover:text-cream-50",
                    )}
                  >
                    {tab === c && (
                      <motion.span
                        layoutId="menu-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-b from-gold-300 to-gold-600"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{c}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:w-56">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-cream-200/35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <label>
                  <span className="sr-only">Search the menu</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    maxLength={60}
                    placeholder="Search…"
                    className="w-full rounded-full border border-cream-200/15 bg-espresso-900/60 py-2 pr-3 pl-9 text-[13px] text-cream-100 placeholder:text-cream-200/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 focus:outline-none"
                  />
                </label>
              </div>

              <div className="hidden gap-1 sm:flex">
                {(Object.keys(DIET_LABEL) as Diet[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleDiet(d)}
                    title={DIET_LABEL[d]}
                    aria-pressed={diets.includes(d)}
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-full border text-[11px] font-semibold transition-colors",
                      diets.includes(d)
                        ? "border-gold-400 bg-gold-400 text-espresso-950"
                        : "border-cream-200/15 text-cream-200/60 hover:border-gold-400/60",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {filtersActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 overflow-hidden pt-3"
              >
                <span className="text-[11px] text-cream-200/45">
                  {results.length} item{results.length === 1 ? "" : "s"}
                </span>
                <button
                  onClick={() => {
                    setTab("All");
                    setQuery("");
                    setDiets([]);
                  }}
                  className="text-[11px] text-gold-400 underline-offset-4 hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <section className="bg-espresso-950 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          {results.length === 0 ? (
            <div className="py-24 text-center">
              <Spark className="mx-auto h-8 w-8 text-gold-500/50" />
              <p className="font-display mt-5 text-2xl text-cream-100">Nothing matches that</p>
              <p className="mt-2 text-[14px] text-cream-200/50">
                Try a different category, or clear your filters.
              </p>
            </div>
          ) : (
            <LayoutGroup>
              <div className="space-y-20">
                {grouped.map(([category, items]) => (
                  <div key={category}>
                    <Reveal>
                      <div className="mb-8 flex items-baseline gap-4">
                        <h2 className="font-display text-3xl text-cream-50 sm:text-4xl">{category}</h2>
                        <span className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" />
                        <span className="text-[12px] text-cream-200/40">{items.length}</span>
                      </div>
                    </Reveal>
                    <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      <AnimatePresence mode="popLayout">
                        {items.map((item, i) => (
                          <MenuCard key={item.id} item={item} index={i} onOpen={setDetail} />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                ))}
              </div>
            </LayoutGroup>
          )}

          <Ornament className="mt-24" />
          <Reveal className="mt-10 text-center">
            <p className="mx-auto max-w-lg text-[13px] leading-relaxed text-cream-200/45">
              Our kitchen handles nuts, dairy, gluten and eggs. We take allergies seriously but cannot
              guarantee an allergen-free environment — please tell the counter before you order.
            </p>
          </Reveal>
        </div>
      </section>

      <ItemDetail item={detail} onClose={() => setDetail(null)} />
    </>
  );
}

/* ---------------- Detail modal ---------------- */

function ItemDetail({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const { add } = useCart();
  const { push } = useToast();

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-espresso-950/80 backdrop-blur-sm"
          />
          <div className="pointer-events-none fixed inset-0 z-[75] grid place-items-center p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={item.name}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="pointer-events-auto grid w-full max-w-3xl overflow-hidden rounded-2xl border border-gold-500/25 bg-espresso-900 shadow-[0_50px_100px_-30px_rgba(0,0,0,.95)] sm:grid-cols-2"
            >
              <div className="relative h-56 sm:h-auto">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/70 to-transparent sm:bg-gradient-to-r" />
              </div>

              <div className="relative p-7">
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-cream-200/15 text-cream-200/60 hover:border-gold-400 hover:text-gold-400"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>

                <p className="text-[10px] tracking-[0.24em] text-gold-500 uppercase">{item.category}</p>
                <h3 className="font-display mt-2 pr-8 text-3xl leading-tight text-cream-50">{item.name}</h3>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.signature && <Chip tone="gold">Signature</Chip>}
                  {item.bestseller && <Chip>Bestseller</Chip>}
                  {item.diet.map((d) => (
                    <Chip key={d} tone="green">
                      {DIET_LABEL[d]}
                    </Chip>
                  ))}
                </div>

                <p className="mt-5 text-[14px] leading-relaxed text-cream-200/65">{item.detail}</p>

                <div className="mt-7 flex items-end justify-between border-t border-cream-200/10 pt-5">
                  <div>
                    <p className="font-display text-2xl text-gold-400">৳{item.price}</p>
                    {item.priceLarge && (
                      <p className="text-[11px] text-cream-200/40">৳{item.priceLarge} large</p>
                    )}
                  </div>
                  <GoldButton
                    onClick={() => {
                      add(item);
                      push({ title: `${item.name} added`, body: "View your bag to check out." });
                      onClose();
                    }}
                  >
                    Add to bag
                    <Arrow className="h-4 w-4" />
                  </GoldButton>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

