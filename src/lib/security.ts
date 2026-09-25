/**
 * Input hardening utilities.
 *
 * NOTE: everything here is *defence in depth* for the browser layer only.
 * Every check in this file must be duplicated on the server. A client can
 * always bypass client-side validation with devtools.
 */

/** Strip characters that are meaningful in HTML so untrusted text can never
 *  become markup. We never use dangerouslySetInnerHTML anywhere in this app,
 *  so this is a second line of defence. */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"'`=/]/g, (c) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "`": "&#96;",
      "=": "&#61;",
      "/": "&#47;",
    };
    return map[c];
  });
}

/** Remove control chars, collapse whitespace, clamp length. */
export function sanitizeText(input: string, maxLen = 500): string {
  return input
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

/** Conservative RFC-5322-ish email check. Deliberately strict. */
export function isValidEmail(email: string): boolean {
  if (email.length > 254) return false;
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(email);
}

/** Bangladesh mobile: +8801XXXXXXXXX / 01XXXXXXXXX (11 digits). */
export function isValidBdPhone(phone: string): boolean {
  const digits = phone.replace(/[\s-]/g, "");
  return /^(?:\+?880|0)1[3-9]\d{8}$/.test(digits);
}

export function normalizeBdPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("880")) return `+${d}`;
  if (d.startsWith("0")) return `+880${d.slice(1)}`;
  return `+880${d}`;
}

export type PasswordScore = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  failures: string[];
};

export function scorePassword(pw: string): PasswordScore {
  const failures: string[] = [];
  if (pw.length < 12) failures.push("At least 12 characters");
  if (!/[a-z]/.test(pw)) failures.push("A lowercase letter");
  if (!/[A-Z]/.test(pw)) failures.push("An uppercase letter");
  if (!/\d/.test(pw)) failures.push("A number");
  if (!/[^A-Za-z0-9]/.test(pw)) failures.push("A symbol");

  // Reject the usual suspects outright.
  const common = ["password", "12345678", "qwerty", "letmein", "izcafe", "coffee"];
  if (common.some((c) => pw.toLowerCase().includes(c))) {
    failures.push("Must not contain a common word");
  }

  const passed = 5 - Math.min(5, failures.length);
  const score = Math.max(0, Math.min(4, passed - 1)) as PasswordScore["score"];
  const label = ["Very weak", "Weak", "Fair", "Strong", "Excellent"][score];
  return { score, label, failures };
}

/**
 * Timing-safe-ish string compare. Real constant-time comparison belongs on the
 * server; this only removes the trivially observable early-exit in JS.
 */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Cryptographically strong random id (used for CSRF-style form nonces). */
export function randomToken(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** SHA-256 hex digest — used so we never keep a raw password in memory/state. */
export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Only allow http(s) links — blocks javascript: / data: URL injection. */
export function safeUrl(url: string): string {
  try {
    const u = new URL(url, window.location.origin);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "#";
  } catch {
    return "#";
  }
}

