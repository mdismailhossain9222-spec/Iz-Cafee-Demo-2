import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { BRANCHES, IMG, OCCASIONS, TIME_SLOTS } from "../data";
import { request } from "../lib/api";
import {
  isValidBdPhone,
  isValidEmail,
  normalizeBdPhone,
  randomToken,
  sanitizeText,
} from "../lib/security";
import { cn } from "../utils/cn";
import { Arrow, Clock, Pin, Shield } from "../components/Icons";
import { Reveal } from "../components/motion-primitives";
import { GoldButton, PageHero } from "../components/ui";

const STEPS = ["Where & when", "Your party", "Your details"];

export default function ReservePage() {
  const [step, setStep] = useState(0);
  const [branch, setBranch] = useState(BRANCHES[0].id);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [guests, setGuests] = useState(2);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ref, setRef] = useState<string | null>(null);

  const honeypot = useRef("");
  const mountedAt = useRef(Date.now());
  const nonce = useRef(randomToken(12));

  // Bookings open from today up to 60 days out.
  const { min, max } = useMemo(() => {
    const t = new Date();
    const later = new Date(t.getTime() + 60 * 864e5);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return { min: fmt(t), max: fmt(later) };
  }, []);

  const selectedBranch = BRANCHES.find((b) => b.id === branch)!;

  function validateStep(i: number): string {
    if (i === 0) {
      if (!date) return "Please choose a date.";
      if (date < min) return "That date has already passed.";
      if (date > max) return "We take bookings up to 60 days ahead.";
      if (!slot) return "Please choose a time.";
    }
    if (i === 1) {
      if (guests < 1 || guests > 20) return "Parties are 1–20 guests. For more, email us.";
    }
    if (i === 2) {
      if (sanitizeText(name, 80).length < 2) return "Please enter your name.";
      if (!isValidBdPhone(phone)) return "Enter a valid Bangladeshi mobile (e.g. 01712 345678).";
      if (email && !isValidEmail(email)) return "That email doesn't look right.";
    }
    return "";
  }

  function next() {
    const msg = validateStep(step);
    if (msg) return setError(msg);
    setError("");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const msg = validateStep(2);
    if (msg) return setError(msg);
    if (honeypot.current) return;
    if (Date.now() - mountedAt.current < 2500) {
      return setError("Please take a moment to review your booking.");
    }

    setBusy(true);
    setError("");
    try {
      const res = await request<{ ok: true; reference: string }>("/reservations", {
        method: "POST",
        body: {
          nonce: nonce.current,
          branch,
          date,
          slot,
          guests,
          occasion,
          notes: sanitizeText(notes, 300),
          name: sanitizeText(name, 80),
          phone: normalizeBdPhone(phone),
          email: email ? sanitizeText(email, 254).toLowerCase() : undefined,
        },
      });
      setRef(res.reference);
    } catch {
      setError("We couldn't reach the host stand. Please call the branch directly.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Reservations"
        title="Save yourself"
        accent="a seat"
        copy="Tables are held for fifteen minutes past your slot. For parties over eight, give us a call so we can set the room properly."
        image={IMG.interior}
      />

      <section className="bg-espresso-950 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.15fr] lg:px-10">
          {/* Summary rail */}
          <Reveal>
            <aside className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-2xl border border-cream-200/10 bg-espresso-900/50">
                <img src={selectedBranch.image} alt="" aria-hidden className="h-40 w-full object-cover" />
                <div className="p-6">
                  <h2 className="font-display text-2xl text-cream-50">{selectedBranch.area}</h2>
                  <p className="mt-2 flex gap-2 text-[13px] text-cream-200/55">
                    <Pin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70" />
                    {selectedBranch.address}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-[13px] text-cream-200/55">
                    <Clock className="h-4 w-4 shrink-0 text-gold-500/70" />
                    {selectedBranch.hours}
                  </p>

                  <dl className="mt-6 space-y-2 border-t border-cream-200/10 pt-5 text-[13px]">
                    <Row label="Date" value={date || "—"} />
                    <Row label="Time" value={slot || "—"} />
                    <Row label="Guests" value={String(guests)} />
                    <Row label="Occasion" value={occasion} />
                  </dl>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-cream-200/10 bg-espresso-900/40 p-4">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/80" />
                <p className="text-[11.5px] leading-relaxed text-cream-200/50">
                  We only store your name and number to hold the table. No card details are taken, and
                  we never pass your details to anyone else.
                </p>
              </div>
            </aside>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-cream-200/12 bg-espresso-900/60 p-6 backdrop-blur-sm sm:p-9">
              <AnimatePresence mode="wait">
                {ref ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold-400/50 text-2xl">
                      🕯️
                    </div>
                    <h3 className="font-display mt-6 text-3xl text-cream-50">Table held</h3>
                    <p className="mt-3 text-[14px] text-cream-200/60">
                      {selectedBranch.area} · {date} at {slot} · {guests} guest{guests === 1 ? "" : "s"}
                    </p>
                    <p className="mt-2 text-[13px] text-cream-200/45">
                      Reference <span className="font-mono text-gold-400">{ref}</span>
                    </p>
                    <p className="mx-auto mt-5 max-w-sm text-[12px] text-cream-200/40">
                      We'll text a confirmation shortly. Running late? Call{" "}
                      <a href={`tel:${selectedBranch.phone}`} className="text-gold-400">
                        {selectedBranch.phoneDisplay}
                      </a>
                      .
                    </p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} noValidate>
                    {/* Stepper */}
                    <div className="flex items-center gap-2">
                      {STEPS.map((s, i) => (
                        <div key={s} className="flex flex-1 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => i < step && setStep(i)}
                            className={cn(
                              "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] transition-colors",
                              i === step
                                ? "border-gold-400 bg-gold-400 text-espresso-950"
                                : i < step
                                  ? "border-gold-500/50 text-gold-400"
                                  : "border-cream-200/18 text-cream-200/35",
                            )}
                          >
                            {i < step ? "✓" : i + 1}
                          </button>
                          <span
                            className={cn(
                              "hidden text-[11px] sm:block",
                              i === step ? "text-cream-100" : "text-cream-200/35",
                            )}
                          >
                            {s}
                          </span>
                          {i < STEPS.length - 1 && <span className="h-px flex-1 bg-cream-200/12" />}
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      tabIndex={-1}
                      aria-hidden="true"
                      autoComplete="off"
                      onChange={(e) => (honeypot.current = e.target.value)}
                      className="absolute h-0 w-0 opacity-0"
                    />

                    <div className="mt-8 min-h-[19rem]">
                      <AnimatePresence mode="wait">
                        {step === 0 && (
                          <Pane key="s0">
                            <Field label="Branch">
                              <div className="grid gap-2 sm:grid-cols-3">
                                {BRANCHES.map((b) => (
                                  <button
                                    key={b.id}
                                    type="button"
                                    onClick={() => setBranch(b.id)}
                                    className={cn(
                                      "rounded-xl border px-3 py-3 text-left transition-colors",
                                      branch === b.id
                                        ? "border-gold-400 bg-gold-400/10"
                                        : "border-cream-200/15 hover:border-gold-400/50",
                                    )}
                                  >
                                    <span className="block text-[13px] text-cream-100">{b.area}</span>
                                    <span className="mt-0.5 block text-[10px] text-cream-200/40">
                                      {b.seats} seats
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </Field>

                            <Field label="Date" className="mt-5">
                              <input
                                type="date"
                                value={date}
                                min={min}
                                max={max}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-lg border border-cream-200/15 bg-espresso-950/60 px-3.5 py-3 text-[13px] text-cream-100 focus:border-gold-500 focus:outline-none [color-scheme:dark]"
                              />
                            </Field>

                            <Field label="Time" className="mt-5">
                              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                                {TIME_SLOTS.map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setSlot(t)}
                                    className={cn(
                                      "rounded-lg border py-2 text-[12px] transition-colors",
                                      slot === t
                                        ? "border-gold-400 bg-gold-400 text-espresso-950"
                                        : "border-cream-200/15 text-cream-200/70 hover:border-gold-400/50",
                                    )}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </Field>
                          </Pane>
                        )}

                        {step === 1 && (
                          <Pane key="s1">
                            <Field label="Guests">
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                                  className="grid h-11 w-11 place-items-center rounded-full border border-cream-200/18 text-lg text-cream-100 hover:border-gold-400"
                                >
                                  −
                                </button>
                                <span className="font-display w-14 text-center text-4xl text-gold-400">
                                  {guests}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setGuests((g) => Math.min(20, g + 1))}
                                  className="grid h-11 w-11 place-items-center rounded-full border border-cream-200/18 text-lg text-cream-100 hover:border-gold-400"
                                >
                                  +
                                </button>
                                <span className="text-[12px] text-cream-200/40">Max 20 online</span>
                              </div>
                            </Field>

                            <Field label="Occasion" className="mt-7">
                              <div className="flex flex-wrap gap-2">
                                {OCCASIONS.map((o) => (
                                  <button
                                    key={o}
                                    type="button"
                                    onClick={() => setOccasion(o)}
                                    className={cn(
                                      "rounded-full border px-4 py-2 text-[12px] transition-colors",
                                      occasion === o
                                        ? "border-gold-400 bg-gold-400 text-espresso-950"
                                        : "border-cream-200/15 text-cream-200/70 hover:border-gold-400/50",
                                    )}
                                  >
                                    {o}
                                  </button>
                                ))}
                              </div>
                            </Field>

                            <Field label="Anything we should know?" className="mt-7">
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                maxLength={300}
                                rows={3}
                                placeholder="Allergies, a high chair, a quiet corner…"
                                className="w-full resize-none rounded-lg border border-cream-200/15 bg-espresso-950/60 px-3.5 py-3 text-[13px] text-cream-100 placeholder:text-cream-200/30 focus:border-gold-500 focus:outline-none"
                              />
                              <span className="mt-1 block text-right text-[10px] text-cream-200/30">
                                {notes.length}/300
                              </span>
                            </Field>
                          </Pane>
                        )}

                        {step === 2 && (
                          <Pane key="s2">
                            <Field label="Name">
                              <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={80}
                                autoComplete="name"
                                placeholder="Your name"
                                className="w-full rounded-lg border border-cream-200/15 bg-espresso-950/60 px-3.5 py-3 text-[13px] text-cream-100 placeholder:text-cream-200/30 focus:border-gold-500 focus:outline-none"
                              />
                            </Field>
                            <Field label="Mobile" className="mt-5">
                              <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                inputMode="tel"
                                maxLength={16}
                                autoComplete="tel"
                                placeholder="01712 345678"
                                className="w-full rounded-lg border border-cream-200/15 bg-espresso-950/60 px-3.5 py-3 text-[13px] text-cream-100 placeholder:text-cream-200/30 focus:border-gold-500 focus:outline-none"
                              />
                            </Field>
                            <Field label="Email (optional)" className="mt-5">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                maxLength={254}
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-cream-200/15 bg-espresso-950/60 px-3.5 py-3 text-[13px] text-cream-100 placeholder:text-cream-200/30 focus:border-gold-500 focus:outline-none"
                              />
                            </Field>
                          </Pane>
                        )}
                      </AnimatePresence>
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                        className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-[12px] text-red-200"
                      >
                        {error}
                      </motion.p>
                    )}

                    <div className="flex items-center gap-3 border-t border-cream-200/10 pt-6">
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setStep((s) => s - 1);
                          }}
                          className="rounded-full border border-cream-200/20 px-5 py-3 text-[13px] text-cream-100 hover:border-gold-400"
                        >
                          Back
                        </button>
                      )}
                      {step < STEPS.length - 1 ? (
                        <GoldButton type="button" onClick={next} className="flex-1">
                          Continue
                          <Arrow className="h-4 w-4" />
                        </GoldButton>
                      ) : (
                        <GoldButton type="submit" disabled={busy} className="flex-1">
                          {busy ? "Holding your table…" : "Confirm reservation"}
                          {!busy && <Arrow className="h-4 w-4" />}
                        </GoldButton>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Pane({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
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
    <div className={className}>
      <span className="mb-2 block text-[10px] tracking-[0.2em] text-cream-200/45 uppercase">{label}</span>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-cream-200/45">{label}</dt>
      <dd className="truncate text-cream-100">{value}</dd>
    </div>
  );
}
