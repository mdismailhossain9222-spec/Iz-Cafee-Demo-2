import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DEMO_CREDENTIALS, request, type LoginResponse } from "../lib/api";
import {
  formatDuration,
  getState,
  recordFailure,
  recordSuccess,
  type ThrottleState,
} from "../lib/rateLimit";
import { isValidEmail, randomToken, sanitizeText, scorePassword } from "../lib/security";
import { Arrow, Lock, Shield, Star } from "../components/Icons";
import { AnimatedText, Reveal } from "../components/motion-primitives";

export default function Members() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [member, setMember] = useState<LoginResponse["member"] | null>(null);
  const [throttle, setThrottle] = useState<ThrottleState>(() => getState());
  const [showPw, setShowPw] = useState(false);

  const honeypot = useRef("");
  const nonce = useRef(randomToken(12));

  // Live countdown while locked out.
  useEffect(() => {
    if (!throttle.locked) return;
    const t = setInterval(() => setThrottle(getState()), 1000);
    return () => clearInterval(t);
  }, [throttle.locked]);

  const strength = scorePassword(password);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (honeypot.current) return;

    const state = getState();
    if (state.locked) {
      setThrottle(state);
      setError(`Too many attempts. Try again in ${formatDuration(state.retryAfterMs)}.`);
      return;
    }

    const cleanEmail = sanitizeText(email, 254).toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setBusy(true);
    try {
      const res = await request<LoginResponse>("/auth/login", {
        method: "POST",
        retries: 0, // never auto-retry an auth attempt
        body: { nonce: nonce.current, email: cleanEmail, password },
      });
      recordSuccess();
      setThrottle(getState());
      setMember(res.member);
      setPassword(""); // drop the secret from state immediately
    } catch {
      const next = recordFailure();
      setThrottle(next);
      // Deliberately generic — never reveal whether the account exists.
      setError(
        next.locked
          ? `Too many attempts. Locked for ${formatDuration(next.retryAfterMs)}.`
          : `Incorrect email or password. ${next.attemptsRemaining} attempt${
              next.attemptsRemaining === 1 ? "" : "s"
            } remaining.`,
      );
      setPassword("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="members" className="relative overflow-hidden bg-espresso-950 py-24 lg:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl leading-[1.1] font-medium text-cream-50 sm:text-4xl">
            <AnimatedText text="How the club works" />
          </h2>

          <div className="mt-8 space-y-3">
            {[
              { icon: Shield, t: "Rate-limited sign-in", d: "5 attempts per 15 minutes, then a progressive lockout." },
              { icon: Lock, t: "No password reuse", d: "12+ characters with mixed case, digits and symbols." },
              { icon: Star, t: "Gold tier at 2,000 pts", d: "Free extras, priority pickup and member-only bakes." },
            ].map((f) => (
              <div key={f.t} className="flex gap-3.5 rounded-xl border border-cream-200/10 bg-espresso-900/40 p-4">
                <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-500/80" />
                <div>
                  <p className="text-[13px] font-medium text-cream-100">{f.t}</p>
                  <p className="mt-0.5 text-[12px] text-cream-200/50">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative rounded-2xl border border-cream-200/12 bg-gradient-to-b from-espresso-900/90 to-espresso-950 p-7 backdrop-blur-sm sm:p-9">
            <AnimatePresence mode="wait">
              {member ? (
                <motion.div
                  key="in"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center"
                >
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold-400/50 bg-espresso-950">
                    <span className="font-display text-xl text-gold-300">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-display mt-5 text-2xl text-cream-50">
                    Welcome back, {member.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-cream-200/55">
                    {member.tier} tier · {member.points.toLocaleString()} points
                  </p>

                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-espresso-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (member.points / 3000) * 100)}%` }}
                      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300"
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-cream-200/40">
                    {(3000 - member.points).toLocaleString()} points to Platinum
                  </p>

                  <button
                    onClick={() => setMember(null)}
                    className="mt-7 rounded-full border border-cream-200/20 px-6 py-2.5 text-[13px] text-cream-100 hover:border-gold-400"
                  >
                    Sign out
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
                  <h3 className="font-display text-2xl text-cream-50">Member sign in</h3>
                  <p className="mt-1.5 text-[12px] text-cream-200/45">
                    Demo: <span className="text-gold-400/80">{DEMO_CREDENTIALS.email}</span> /{" "}
                    <span className="text-gold-400/80">{DEMO_CREDENTIALS.password}</span>
                  </p>

                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    onChange={(e) => (honeypot.current = e.target.value)}
                    className="absolute h-0 w-0 opacity-0"
                  />

                  <div className="mt-6 space-y-4">
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] tracking-[0.2em] text-cream-200/45 uppercase">
                        Email
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={throttle.locked}
                        autoComplete="email"
                        maxLength={254}
                        required
                        className="w-full rounded-lg border border-cream-200/15 bg-espresso-900/60 px-3.5 py-3 text-[13px] text-cream-100 placeholder:text-cream-200/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 focus:outline-none disabled:opacity-50"
                        placeholder="you@example.com"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[10px] tracking-[0.2em] text-cream-200/45 uppercase">
                        Password
                      </span>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={throttle.locked}
                          autoComplete="current-password"
                          maxLength={128}
                          required
                          className="w-full rounded-lg border border-cream-200/15 bg-espresso-900/60 px-3.5 py-3 pr-16 text-[13px] text-cream-100 placeholder:text-cream-200/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 focus:outline-none disabled:opacity-50"
                          placeholder="••••••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((s) => !s)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-[11px] text-cream-200/45 hover:text-gold-400"
                        >
                          {showPw ? "Hide" : "Show"}
                        </button>
                      </div>
                    </label>

                    {/* Strength meter */}
                    {password.length > 0 && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <span
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                i < strength.score
                                  ? strength.score <= 1
                                    ? "bg-red-400"
                                    : strength.score === 2
                                      ? "bg-amber-400"
                                      : "bg-emerald-400"
                                  : "bg-cream-200/12"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-1.5 text-[11px] text-cream-200/45">
                          {strength.label}
                          {strength.failures.length > 0 && ` — needs: ${strength.failures[0].toLowerCase()}`}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Throttle / error surface */}
                  <AnimatePresence>
                    {(error || throttle.locked) && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        role="alert"
                        aria-live="polite"
                        className={`mt-5 flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[12px] ${
                          throttle.locked
                            ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                            : "border-red-400/30 bg-red-500/10 text-red-200"
                        }`}
                      >
                        <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          {throttle.locked
                            ? `Account temporarily locked. Try again in ${formatDuration(throttle.retryAfterMs)}.`
                            : error}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={busy || throttle.locked}
                    className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 py-3.5 text-[14px] font-semibold text-espresso-950 transition-all hover:shadow-[0_12px_36px_-10px_rgba(198,167,94,.8)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? "Verifying…" : throttle.locked ? "Locked" : "Sign in"}
                    {!busy && !throttle.locked && (
                      <Arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </button>

                  {!throttle.locked && throttle.attemptsRemaining < 5 && (
                    <p className="mt-3 text-center text-[11px] text-cream-200/40">
                      {throttle.attemptsRemaining} of 5 attempts remaining in this window
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
