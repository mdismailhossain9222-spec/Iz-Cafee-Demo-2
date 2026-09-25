import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { BRANCHES } from "../data";
import { request, type OrderResponse } from "../lib/api";
import { useCart } from "../lib/cart";
import {
  isValidBdPhone,
  normalizeBdPhone,
  randomToken,
  sanitizeText,
} from "../lib/security";
import { Arrow, Bag, Shield } from "../components/Icons";
import { AnimatedText, Reveal } from "../components/motion-primitives";

export default function Grab() {
  const { lines, add, remove, clear, count, total } = useCart();
  const [branch, setBranch] = useState(BRANCHES[0].id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [result, setResult] = useState<OrderResponse | null>(null);
  const [error, setError] = useState("");

  // Bot defences: a honeypot field plus a minimum human fill time.
  const honeypot = useRef("");
  const mountedAt = useRef(Date.now());
  const nonce = useRef(randomToken(12));

  const delivery = total >= 1500 ? 0 : 79;
  const grand = total + (count ? delivery : 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (honeypot.current) return; // silent drop
    if (Date.now() - mountedAt.current < 2500) {
      setError("Please take a moment to review your order.");
      return;
    }
    if (!count) {
      setError("Your bag is empty — add something from the counter first.");
      return;
    }
    const cleanName = sanitizeText(name, 80);
    if (cleanName.length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidBdPhone(phone)) {
      setError("Enter a valid Bangladeshi mobile number (e.g. 01712 345678).");
      return;
    }

    setStatus("sending");
    try {
      const res = await request<OrderResponse>("/orders", {
        method: "POST",
        timeout: 9000,
        body: {
          nonce: nonce.current,
          branch,
          name: cleanName,
          phone: normalizeBdPhone(phone),
          lines: lines.map((l) => ({ id: l.item.id, qty: l.qty })),
        },
      });
      setResult(res);
      setStatus("done");
      clear();
    } catch {
      setStatus("error");
      setError("We couldn't reach the kitchen. Please call the branch directly.");
    }
  }

  return (
    <section id="grab" className="relative overflow-hidden bg-espresso-900 py-24 lg:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full opacity-20 [background:radial-gradient(circle,rgba(198,167,94,.7),transparent_65%)] blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-[1fr_1.05fr] lg:gap-20 lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl leading-[1.1] font-medium text-cream-50 sm:text-4xl">
            <AnimatedText text="How it works" />
          </h2>

          <ul className="mt-8 space-y-3">
            {[
              "Freshly filled — never pre-made",
              "Insulated boxes for cold drinks",
              "Live order reference on confirmation",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-[14px] text-cream-200/70">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-gold-500/40 text-[10px] text-gold-400">
                  ✓
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex items-start gap-3 rounded-xl border border-cream-200/10 bg-espresso-950/40 p-4">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-gold-500/80" />
            <p className="text-[12px] leading-relaxed text-cream-200/55">
              We ask only for a name and mobile number — no account needed, no card details taken
              online. Payment is on delivery or at the counter.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-2xl border border-cream-200/12 bg-espresso-950/70 p-6 backdrop-blur-sm sm:p-8">
            <AnimatePresence mode="wait">
              {status === "done" && result ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center"
                >
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold-400/50 text-2xl">
                    ☕
                  </div>
                  <h3 className="font-display mt-5 text-2xl text-cream-50">Order received</h3>
                  <p className="mt-2 text-sm text-cream-200/65">
                    Reference{" "}
                    <span className="font-mono text-gold-400">{result.reference}</span> · ready in
                    about {result.etaMinutes} minutes.
                  </p>
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setResult(null);
                    }}
                    className="mt-7 rounded-full border border-cream-200/20 px-6 py-2.5 text-[13px] text-cream-100 hover:border-gold-400"
                  >
                    Place another order
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  noValidate
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display flex items-center gap-2 text-xl text-cream-50">
                      <Bag className="h-5 w-5 text-gold-400" />
                      Your bag
                    </h3>
                    <span className="text-[12px] text-cream-200/50">
                      {count} item{count === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="mt-5 max-h-56 space-y-2 overflow-y-auto pr-1">
                    <AnimatePresence initial={false}>
                      {lines.length === 0 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-lg border border-dashed border-cream-200/15 py-8 text-center text-[13px] text-cream-200/40"
                        >
                          Nothing here yet — add something from The Counter.
                        </motion.p>
                      )}
                      {lines.map((l) => (
                        <motion.div
                          key={l.item.id}
                          layout
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          className="flex items-center gap-3 rounded-lg bg-espresso-900/70 p-2.5"
                        >
                          <img
                            src={l.item.image}
                            alt=""
                            aria-hidden
                            className="h-11 w-11 rounded-md object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] text-cream-100">{l.item.name}</p>
                            <p className="text-[11px] text-cream-200/45">৳{l.item.price} each</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => remove(l.item.id)}
                              aria-label={`Remove one ${l.item.name}`}
                              className="grid h-6 w-6 place-items-center rounded-full border border-cream-200/20 text-cream-200/70 hover:border-gold-400"
                            >
                              −
                            </button>
                            <span className="w-5 text-center text-[13px] text-cream-100">{l.qty}</span>
                            <button
                              type="button"
                              onClick={() => add(l.item)}
                              aria-label={`Add one ${l.item.name}`}
                              className="grid h-6 w-6 place-items-center rounded-full border border-cream-200/20 text-cream-200/70 hover:border-gold-400"
                            >
                              +
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Honeypot — invisible to humans, irresistible to bots */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    onChange={(e) => (honeypot.current = e.target.value)}
                    className="absolute h-0 w-0 opacity-0"
                  />

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <Field label="Name">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={80}
                        autoComplete="name"
                        required
                        className="w-full rounded-lg border border-cream-200/15 bg-espresso-900/60 px-3.5 py-2.5 text-[13px] text-cream-100 placeholder:text-cream-200/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 focus:outline-none"
                        placeholder="Your name"
                      />
                    </Field>
                    <Field label="Mobile">
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="tel"
                        maxLength={16}
                        autoComplete="tel"
                        required
                        className="w-full rounded-lg border border-cream-200/15 bg-espresso-900/60 px-3.5 py-2.5 text-[13px] text-cream-100 placeholder:text-cream-200/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 focus:outline-none"
                        placeholder="01712 345678"
                      />
                    </Field>
                  </div>

                  <Field label="Branch" className="mt-3">
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full rounded-lg border border-cream-200/15 bg-espresso-900/60 px-3.5 py-2.5 text-[13px] text-cream-100 focus:border-gold-500 focus:outline-none"
                    >
                      {BRANCHES.map((b) => (
                        <option key={b.id} value={b.id} className="bg-espresso-900">
                          {b.area}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="mt-6 space-y-1.5 border-t border-cream-200/10 pt-5 text-[13px]">
                    <Row label="Subtotal" value={`৳${total}`} />
                    <Row
                      label="Delivery"
                      value={count === 0 ? "—" : delivery === 0 ? "Free" : `৳${delivery}`}
                    />
                    <div className="flex justify-between pt-2 text-base">
                      <span className="text-cream-100">Total</span>
                      <span className="font-display text-gold-400">৳{grand}</span>
                    </div>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-[12px] text-red-200"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 py-3.5 text-[14px] font-semibold text-espresso-950 transition-all hover:shadow-[0_12px_36px_-10px_rgba(198,167,94,.8)] disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending to kitchen…" : "Confirm order"}
                    {status !== "sending" && (
                      <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[10px] tracking-[0.2em] text-cream-200/45 uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-cream-200/60">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
