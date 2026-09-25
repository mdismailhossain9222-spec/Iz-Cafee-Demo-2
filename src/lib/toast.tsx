import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type Toast = { id: number; title: string; body?: string };

const Ctx = createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const seq = useRef(0);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = ++seq.current;
    setItems((prev) => [...prev.slice(-2), { ...t, id }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 2800);
  }, []);

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div
        className="pointer-events-none fixed right-4 bottom-4 z-[80] flex flex-col gap-2 sm:right-6 sm:bottom-6"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              className="pointer-events-auto flex max-w-xs items-start gap-3 rounded-xl border border-gold-500/30 bg-espresso-900/95 px-4 py-3 shadow-[0_20px_50px_-18px_rgba(0,0,0,.9)] backdrop-blur-lg"
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-400 text-[11px] text-espresso-950">
                ✓
              </span>
              <div>
                <p className="text-[13px] font-medium text-cream-50">{t.title}</p>
                {t.body && <p className="mt-0.5 text-[11px] text-cream-200/55">{t.body}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast must be used inside <ToastProvider>");
  return c;
}

