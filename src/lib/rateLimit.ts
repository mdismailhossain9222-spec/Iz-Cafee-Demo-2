/**
 * Login throttling with progressive lockout.
 *
 * IMPORTANT: this is a UX guard, not a security boundary. An attacker can clear
 * localStorage. The identical policy MUST be enforced server-side, keyed on
 * (account, IP, device fingerprint). This exists to stop honest users from
 * hammering the endpoint and to surface lockout state in the UI.
 *
 * Policy
 *  - Sliding window: 15 minutes.
 *  - 5 failures in the window  -> locked.
 *  - Lockout duration escalates: 30s, 2m, 10m, 30m, 60m (capped).
 *  - A success clears the failure record entirely.
 */

const KEY = "iz.auth.throttle.v1";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCK_LADDER_MS = [30_000, 120_000, 600_000, 1_800_000, 3_600_000];

type Record_ = {
  failures: number[]; // timestamps
  lockUntil: number;
  lockLevel: number;
};

function read(): Record_ {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { failures: [], lockUntil: 0, lockLevel: 0 };
    const parsed = JSON.parse(raw) as Record_;
    if (!Array.isArray(parsed.failures)) throw new Error("bad shape");
    return {
      failures: parsed.failures.filter((n) => typeof n === "number"),
      lockUntil: Number(parsed.lockUntil) || 0,
      lockLevel: Number(parsed.lockLevel) || 0,
    };
  } catch {
    return { failures: [], lockUntil: 0, lockLevel: 0 };
  }
}

function write(r: Record_) {
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
  } catch {
    /* storage disabled / quota — fail open on the client, server still guards */
  }
}

export type ThrottleState = {
  locked: boolean;
  retryAfterMs: number;
  attemptsRemaining: number;
};

export function getState(now = Date.now()): ThrottleState {
  const r = read();
  const recent = r.failures.filter((t) => now - t < WINDOW_MS);

  if (r.lockUntil > now) {
    return { locked: true, retryAfterMs: r.lockUntil - now, attemptsRemaining: 0 };
  }
  return {
    locked: false,
    retryAfterMs: 0,
    attemptsRemaining: Math.max(0, MAX_ATTEMPTS - recent.length),
  };
}

export function recordFailure(now = Date.now()): ThrottleState {
  const r = read();
  const recent = r.failures.filter((t) => now - t < WINDOW_MS);
  recent.push(now);

  if (recent.length >= MAX_ATTEMPTS) {
    const level = Math.min(r.lockLevel, LOCK_LADDER_MS.length - 1);
    const lockMs = LOCK_LADDER_MS[level];
    const next: Record_ = {
      failures: [],
      lockUntil: now + lockMs,
      lockLevel: Math.min(r.lockLevel + 1, LOCK_LADDER_MS.length - 1),
    };
    write(next);
    return { locked: true, retryAfterMs: lockMs, attemptsRemaining: 0 };
  }

  write({ ...r, failures: recent });
  return {
    locked: false,
    retryAfterMs: 0,
    attemptsRemaining: MAX_ATTEMPTS - recent.length,
  };
}

export function recordSuccess() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

export function formatDuration(ms: number): string {
  const s = Math.ceil(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem ? `${m}m ${rem}s` : `${m}m`;
}

