import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useCart } from "../lib/cart";
import { Link } from "../lib/router";
import { Arrow, Bag } from "./Icons";
import { GoldButton } from "./ui";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, add, remove, count, total } = useCart();
  const delivery = total >= 1500 ? 0 : 79;

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-espresso-950/75 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 34 }}
            className="fixed top-0 right-0 z-[75] flex h-full w-full max-w-sm flex-col border-l border-gold-500/20 bg-espresso-950"
          >
            <header className="flex items-center justify-between border-b border-cream-200/10 px-6 py-5">
              <h2 className="font-display flex items-center gap-2.5 text-xl text-cream-50">
                <Bag className="h-5 w-5 text-gold-400" />
                Your bag
              </h2>
              <button
                onClick={onClose}
                aria-label="Close bag"
                className="grid h-9 w-9 place-items-center rounded-full border border-cream-200/15 text-cream-200/70 transition-colors hover:border-gold-400 hover:text-gold-400"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-dashed border-cream-200/20 text-2xl">
                    🥐
                  </span>
                  <p className="font-display mt-5 text-lg text-cream-100">Nothing here yet</p>
                  <p className="mt-1.5 max-w-[15rem] text-[13px] text-cream-200/45">
                    Browse the full menu and add something worth the detour.
                  </p>
                  <Link
                    to="/menu"
                    onNavigate={onClose}
                    className="mt-6 rounded-full border border-cream-200/20 px-5 py-2.5 text-[13px] text-cream-100 hover:border-gold-400"
                  >
                    View the menu
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.item.id}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24, height: 0 }}
                        className="flex gap-3 rounded-xl border border-cream-200/8 bg-espresso-900/60 p-3"
                      >
                        <img
                          src={l.item.image}
                          alt=""
                          aria-hidden
                          className="h-14 w-14 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] text-cream-100">{l.item.name}</p>
                          <p className="text-[11px] text-cream-200/45">৳{l.item.price}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => remove(l.item.id)}
                              aria-label={`Remove one ${l.item.name}`}
                              className="grid h-6 w-6 place-items-center rounded-full border border-cream-200/20 text-cream-200/70 hover:border-gold-400 hover:text-gold-400"
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-[13px] text-cream-100">{l.qty}</span>
                            <button
                              onClick={() => add(l.item)}
                              aria-label={`Add one ${l.item.name}`}
                              className="grid h-6 w-6 place-items-center rounded-full border border-cream-200/20 text-cream-200/70 hover:border-gold-400 hover:text-gold-400"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <span className="font-display shrink-0 text-[15px] text-gold-400">
                          ৳{l.qty * l.item.price}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-cream-200/10 px-6 py-5">
                <div className="space-y-1.5 text-[13px]">
                  <div className="flex justify-between text-cream-200/60">
                    <span>Subtotal ({count})</span>
                    <span>৳{total}</span>
                  </div>
                  <div className="flex justify-between text-cream-200/60">
                    <span>Delivery</span>
                    <span>{delivery === 0 ? "Free" : `৳${delivery}`}</span>
                  </div>
                  {delivery > 0 && (
                    <p className="pt-1 text-[11px] text-gold-400/70">
                      ৳{1500 - total} more for free delivery
                    </p>
                  )}
                  <div className="flex justify-between border-t border-cream-200/10 pt-3 text-base">
                    <span className="text-cream-100">Total</span>
                    <span className="font-display text-gold-400">৳{total + delivery}</span>
                  </div>
                </div>

                <Link to="/order" onNavigate={onClose} className="mt-5 block">
                  <GoldButton as="span" className="w-full">
                    Checkout with IZ Grab
                    <Arrow className="h-4 w-4" />
                  </GoldButton>
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
