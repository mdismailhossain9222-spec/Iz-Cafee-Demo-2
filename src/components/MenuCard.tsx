import { motion } from "motion/react";
import { DIET_LABEL, type MenuItem } from "../data";
import { useCart } from "../lib/cart";
import { useToast } from "../lib/toast";
import { Arrow } from "./Icons";
import { Layer, Tilt } from "./motion-primitives";
import { Chip } from "./ui";

export default function MenuCard({
  item,
  index = 0,
  onOpen,
}: {
  item: MenuItem;
  index?: number;
  onOpen?: (item: MenuItem) => void;
}) {
  const { add } = useCart();
  const { push } = useToast();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.22 } }}
      transition={{ duration: 0.6, delay: Math.min(index, 8) * 0.045, ease: [0.16, 1, 0.3, 1] }}
    >
      <Tilt className="group h-full" max={9}>
        <article className="preserve-3d relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-cream-200/10 bg-espresso-900/70 backdrop-blur-sm transition-colors duration-500 group-hover:border-gold-500/40">
          <button
            onClick={() => onOpen?.(item)}
            className="relative block h-48 w-full overflow-hidden text-left"
            aria-label={`View details for ${item.name}`}
          >
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1.3s] ease-out group-hover:scale-[1.12]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-900 via-espresso-900/15 to-transparent" />

            <Layer z={45} className="absolute top-3 left-3 flex gap-1.5">
              {item.signature && (
                <span className="rounded-full border border-gold-400/50 bg-espresso-950/75 px-2.5 py-1 text-[9px] tracking-[0.18em] text-gold-300 uppercase backdrop-blur-sm">
                  Signature
                </span>
              )}
              {item.bestseller && !item.signature && (
                <span className="rounded-full border border-cream-200/25 bg-espresso-950/75 px-2.5 py-1 text-[9px] tracking-[0.18em] text-cream-100 uppercase backdrop-blur-sm">
                  Bestseller
                </span>
              )}
            </Layer>

            {item.diet.length > 0 && (
              <Layer z={40} className="absolute right-3 bottom-3 flex gap-1">
                {item.diet.map((d) => (
                  <span
                    key={d}
                    title={DIET_LABEL[d]}
                    className="grid h-6 w-6 place-items-center rounded-full border border-cream-200/25 bg-espresso-950/70 text-[9px] font-semibold text-cream-100 backdrop-blur-sm"
                  >
                    {d}
                  </span>
                ))}
              </Layer>
            )}
          </button>

          <Layer z={28} className="flex flex-1 flex-col p-5">
            <p className="text-[10px] tracking-[0.24em] text-gold-500/80 uppercase">{item.category}</p>
            <h3 className="font-display mt-2 text-xl leading-snug text-cream-50">{item.name}</h3>
            <p className="mt-2 flex-1 text-[13px] leading-relaxed text-cream-200/55">{item.notes}</p>

            <div className="mt-5 flex items-center justify-between border-t border-cream-200/10 pt-4">
              <span className="font-display text-lg text-gold-400">
                ৳{item.price}
                {item.priceLarge && (
                  <span className="ml-1 text-[11px] text-cream-200/40">/ ৳{item.priceLarge}</span>
                )}
              </span>
              <button
                onClick={() => {
                  add(item);
                  push({ title: `${item.name} added`, body: "View your bag to check out." });
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-cream-200/20 px-3.5 py-2 text-[12px] text-cream-100 transition-all hover:border-gold-400 hover:bg-gold-400 hover:text-espresso-950"
              >
                Add
                <Arrow className="h-3 w-3" />
              </button>
            </div>
          </Layer>
        </article>
      </Tilt>
    </motion.div>
  );
}

export function DietLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(DIET_LABEL) as Array<keyof typeof DIET_LABEL>).map((d) => (
        <Chip key={d}>
          <span className="mr-1.5 font-semibold text-cream-100">{d}</span>
          {DIET_LABEL[d]}
        </Chip>
      ))}
    </div>
  );
}
