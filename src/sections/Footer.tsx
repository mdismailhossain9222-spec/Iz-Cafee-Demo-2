import { motion } from "motion/react";
import { useRef, useState } from "react";
import { BRANCHES, BRAND } from "../data";
import { request } from "../lib/api";
import { Link } from "../lib/router";
import { isValidEmail, randomToken, sanitizeText } from "../lib/security";
import { Arrow } from "../components/Icons";
import { AnimatedText, Reveal } from "../components/motion-primitives";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const honeypot = useRef("");
  const nonce = useRef(randomToken(12));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot.current) return;

    const clean = sanitizeText(email, 254).toLowerCase();
    if (!isValidEmail(clean)) {
      setState("error");
      setMsg("Please enter a valid email address.");
      return;
    }
    setState("busy");
    try {
      await request("/newsletter", { method: "POST", body: { nonce: nonce.current, email: clean } });
      setState("done");
      setEmail("");
    } catch {
      setState("error");
      setMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-gold-500/15 bg-espresso-950">
      {/* Newsletter */}
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl leading-tight font-medium text-cream-50 sm:text-5xl">
            <AnimatedText text="Seasonal bakes," />
            <br />
            <span className="foil italic">
              <AnimatedText text="first dibs" delay={0.15} />
            </span>
          </h2>
          <p className="mt-5 text-[15px] text-cream-200/60">
            One letter a month. New pastries, new origins, nothing else.
          </p>

          {state === "done" ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-8 max-w-sm rounded-full border border-gold-400/40 bg-gold-500/10 px-6 py-3.5 text-[14px] text-gold-200"
            >
              You're on the list — see you at the counter.
            </motion.p>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row" noValidate>
              <input
                type="text"
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                onChange={(e) => (honeypot.current = e.target.value)}
                className="absolute h-0 w-0 opacity-0"
              />
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-full border border-cream-200/15 bg-espresso-900/60 px-5 py-3.5 text-[14px] text-cream-100 placeholder:text-cream-200/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 focus:outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={state === "busy"}
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 px-7 py-3.5 text-[14px] font-semibold text-espresso-950 disabled:opacity-60"
              >
                {state === "busy" ? "Joining…" : "Join"}
                <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          )}
          {state === "error" && <p className="mt-3 text-[12px] text-red-300">{msg}</p>}
        </Reveal>
      </div>

      {/* Links */}
      <div className="border-t border-cream-200/8">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-500/40">
                <img src="/logo.png" alt="Logo" class="h-10 w-auto object-contain brightness-0 invert" />
              </span>
              <span className="font-display text-[15px] text-cream-100">Pâtisserie &amp; Café</span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-cream-200/50">
              {BRAND.tagline}. Artisanal pastries and specialty coffee, baked fresh across Dhaka
              every morning.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { label: "Instagram", href: BRAND.instagram },
                { label: "Facebook", href: BRAND.facebook },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer external"
                  className="rounded-full border border-cream-200/15 px-3.5 py-1.5 text-[11px] text-cream-200/65 transition-colors hover:border-gold-400 hover:text-gold-300"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] tracking-[0.24em] text-gold-500/80 uppercase">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                ["Full menu", "/menu"],
                ["Our craft", "/craft"],
                ["Locations", "/locations"],
                ["The journal", "/journal"],
                ["Reserve a table", "/reserve"],
                ["IZ Grab", "/order"],
                ["IZ Club", "/club"],
              ].map(([l, to]) => (
                <li key={l}>
                  <Link to={to} className="text-[13px] text-cream-200/55 transition-colors hover:text-gold-300">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2">
            <h3 className="text-[10px] tracking-[0.24em] text-gold-500/80 uppercase">Branches</h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-3">
              {BRANCHES.map((b) => (
                <li key={b.id}>
                  <p className="font-display text-[15px] text-cream-100">{b.area}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-cream-200/45">{b.address}</p>
                  <a
                    href={`tel:${b.phone}`}
                    className="mt-1.5 inline-block text-[12px] text-gold-400/85 hover:text-gold-300"
                  >
                    {b.phoneDisplay}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cream-200/8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row lg:px-10">
          <p className="text-[11px] text-cream-200/40">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-[11px] text-cream-200/40">
            <a href={`mailto:${BRAND.email}`} className="hover:text-gold-300">
              {BRAND.email}
            </a>
            <a href="#top" className="hover:text-gold-300">
              Back to top
            </a>
          </div>
        </div>
      </div>

      {/* Oversized watermark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="font-display -mb-6 translate-y-1/4 text-center text-[22vw] leading-none font-bold text-cream-200/[0.025]">
          IZ CAFÉ
        </p>
      </div>
    </footer>
  );
}

