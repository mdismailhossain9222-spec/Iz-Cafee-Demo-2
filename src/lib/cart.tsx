import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { MenuItem } from "../data";

export type Line = { item: MenuItem; qty: number };

type CartCtx = {
  lines: Line[];
  add: (item: MenuItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

const MAX_QTY_PER_ITEM = 20; // guard against runaway/scripted quantities

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);

  const add = useCallback((item: MenuItem) => {
    setLines((prev) => {
      const found = prev.find((l) => l.item.id === item.id);
      if (found) {
        if (found.qty >= MAX_QTY_PER_ITEM) return prev;
        return prev.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { item, qty: 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.item.id === id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const total = lines.reduce((n, l) => n + l.qty * l.item.price, 0);
    return { lines, add, remove, clear, count, total };
  }, [lines, add, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

