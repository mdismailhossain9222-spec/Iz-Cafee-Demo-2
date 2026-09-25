import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Wraps each route: a gold curtain sweeps across, then content rises in. */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <div>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <motion.span
        aria-hidden
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        className="pointer-events-none fixed inset-0 z-[65] origin-top bg-gradient-to-b from-espresso-900 via-espresso-950 to-espresso-950"
      />
      <motion.span
        aria-hidden
        initial={{ scaleX: 1, opacity: 1 }}
        animate={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[66] h-px origin-left bg-gold-400"
      />
      {children}
    </motion.div>
  );
}
