import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { AnimatedText, Reveal } from "./motion-primitives";

/* ---------- Eyebrow label with a drawn gold rule ---------- */
export function Eyebrow({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", center && "justify-center")}>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="block h-px w-8 origin-left bg-gold-500/70"
      />
      <span className="text-[11px] tracking-[0.36em] text-gold-500 uppercase">{children}</span>
    </div>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  accent,
  copy,
  center,
  className,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  copy?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow center={center}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <h2 className="font-display mt-5 text-4xl leading-[1.05] font-medium text-cream-50 sm:text-5xl lg:text-6xl">
        <AnimatedText text={title} />
        {accent && (
          <>
            <br />
            <span className="text-gold-400 italic">
              <AnimatedText text={accent} delay={0.15} />
            </span>
          </>
        )}
      </h2>
      {copy && (
        <Reveal delay={0.2}>
          <p
            className={cn(
              "mt-6 leading-relaxed text-cream-200/65",
              center ? "mx-auto max-w-xl" : "max-w-lg",
            )}
          >
            {copy}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Buttons ---------- */
export function GoldButton({
  children,
  className,
  as = "button",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "button" | "span";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const Tag = as as "button";
  return (
    <Tag
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-gold-300 to-gold-600 px-7 py-3.5 text-[14px] font-semibold text-espresso-950 transition-shadow hover:shadow-[0_14px_40px_-10px_rgba(198,167,94,.85)] disabled:cursor-not-allowed disabled:opacity-55",
        className,
      )}
      {...rest}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center gap-2">{children}</span>
    </Tag>
  );
}

export function GhostButton({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-cream-200/22 px-7 py-3.5 text-[14px] text-cream-100 transition-colors hover:border-gold-400/70 hover:bg-cream-200/5",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------- Badge / dietary chip ---------- */
export function Chip({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "gold" | "green";
  className?: string;
}) {
  const tones = {
    default: "border-cream-200/18 text-cream-200/65",
    gold: "border-gold-400/45 text-gold-300",
    green: "border-emerald-400/35 text-emerald-300/90",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Ornamental divider ---------- */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)} aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/50" />
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-500/70" fill="currentColor">
        <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2z" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/50" />
    </div>
  );
}

/* ---------- Page hero shared by inner pages ---------- */
export function PageHero({
  eyebrow,
  title,
  accent,
  copy,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  copy?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-gold-500/12 bg-espresso-950 pt-36 pb-20 lg:pt-44 lg:pb-24">
      {image && (
        <>
          <motion.img
            src={image}
            alt=""
            aria-hidden
            initial={{ scale: 1.14, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.28 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-espresso-950/85 to-espresso-950/70" />
        </>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full opacity-20 [background:radial-gradient(circle,rgba(198,167,94,.65),transparent_65%)] blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[0.98] font-medium text-cream-50 sm:text-6xl lg:text-7xl">
          <AnimatedText text={title} />
          {accent && (
            <>
              {" "}
              <span className="foil italic">
                <AnimatedText text={accent} delay={0.18} />
              </span>
            </>
          )}
        </h1>
        {copy && (
          <Reveal delay={0.25}>
            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-cream-200/70">{copy}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.35}>{children}</Reveal>}
      </div>
    </header>
  );
}

