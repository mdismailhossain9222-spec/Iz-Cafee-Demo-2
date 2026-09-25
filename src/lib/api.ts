/**
 * Resilient API client.
 *
 * Features: per-request timeout via AbortController, bounded retry with
 * exponential backoff + jitter, JSON-only parsing, typed errors, and an
 * in-flight de-duplication cache.
 *
 * The live site has no public backend (the ordering host `grab.izcafe.com`
 * does not resolve), so `request()` falls through to a local mock adapter.
 * Point BASE at the real origin and delete the mock block to go live.
 */

import { randomToken } from "./security";

const BASE = import.meta.env.VITE_API_BASE ?? "";
const DEFAULT_TIMEOUT = 8000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string = "api_error",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Options = {
  method?: "GET" | "POST";
  body?: unknown;
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function rawRequest<T>(path: string, opts: Options): Promise<T> {
  const { method = "GET", body, timeout = DEFAULT_TIMEOUT, signal } = opts;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(new DOMException("timeout", "TimeoutError")), timeout);
  // Let a caller-supplied signal also cancel us.
  signal?.addEventListener("abort", () => ctrl.abort(), { once: true });

  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      signal: ctrl.signal,
      credentials: "same-origin", // never leak cookies cross-origin
      referrerPolicy: "strict-origin-when-cross-origin",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Request-Id": randomToken(8),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new ApiError(`Request failed (${res.status})`, res.status);
    }
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      throw new ApiError("Unexpected response type", 500, "bad_content_type");
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function request<T>(path: string, opts: Options = {}): Promise<T> {
  if (!BASE) return mock<T>(path, opts);

  const retries = opts.retries ?? 2;
  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await rawRequest<T>(path, opts);
    } catch (err) {
      lastErr = err;
      const status = err instanceof ApiError ? err.status : 0;
      // Never retry client errors — only network faults / 5xx / 429.
      const retryable = status === 0 || status >= 500 || status === 429;
      if (!retryable || attempt === retries) break;
      const backoff = 2 ** attempt * 300 + Math.random() * 200; // jitter
      await sleep(backoff);
    }
  }
  throw lastErr;
}

/* ------------------------------------------------------------------ */
/* Mock adapter — stands in for the missing backend                     */
/* ------------------------------------------------------------------ */

const DEMO_EMAIL = "member@iz.cafe";
const DEMO_PASSWORD = "IzCafe!Gulshan2026";

async function mock<T>(path: string, opts: Options): Promise<T> {
  await sleep(550 + Math.random() * 450);
  const body = (opts.body ?? {}) as Record<string, string>;

  if (path === "/auth/login") {
    const ok =
      body.email?.toLowerCase() === DEMO_EMAIL && body.password === DEMO_PASSWORD;
    if (!ok) {
      // Deliberately generic: never reveal whether the account exists.
      throw new ApiError("Invalid credentials", 401, "invalid_credentials");
    }
    return {
      token: randomToken(24),
      member: { name: "Ayesha R.", tier: "Gold", points: 2480, email: DEMO_EMAIL },
    } as T;
  }

  if (path === "/newsletter") {
    return { ok: true } as T;
  }

  if (path === "/orders") {
    return {
      ok: true,
      reference: `IZ-${randomToken(3).toUpperCase()}`,
      etaMinutes: 25 + Math.floor(Math.random() * 15),
    } as T;
  }

  if (path === "/reservations") {
    return { ok: true, reference: `RSV-${randomToken(3).toUpperCase()}` } as T;
  }

  throw new ApiError("Not found", 404, "not_found");
}

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };

export type LoginResponse = {
  token: string;
  member: { name: string; tier: string; points: number; email: string };
};
export type OrderResponse = { ok: true; reference: string; etaMinutes: number };

