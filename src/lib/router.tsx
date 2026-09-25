import { useCallback, useEffect, useState } from "react";
import { safeUrl } from "./security";

/**
 * Tiny hash router.
 *
 * Hash routing (rather than history API) is deliberate: the production build is
 * a single static index.html, so deep links like /menu would 404 on any host
 * without a catch-all rewrite. `#/menu` always resolves.
 */

export type RouteMatch = {
  path: string;          // "/journal/lamination"
  segments: string[];    // ["journal", "lamination"]
  page: string;          // "journal"
  param?: string;        // "lamination"
  hashTarget?: string;   // in-page anchor, e.g. "menu"
};

function parse(): RouteMatch {
  const raw = window.location.hash.slice(1) || "/";
  // Support "/#section" for in-page anchors on the home page.
  const [pathPart, anchor] = raw.split("#");
  const clean = pathPart.split("?")[0] || "/";
  const segments = clean.split("/").filter(Boolean);
  return {
    path: "/" + segments.join("/"),
    segments,
    page: segments[0] ?? "",
    param: segments[1],
    hashTarget: anchor || undefined,
  };
}

export function useRoute(): RouteMatch {
  const [route, setRoute] = useState<RouteMatch>(parse);

  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export function navigate(to: string, anchor?: string) {
  const next = anchor ? `#${to}#${anchor}` : `#${to}`;
  if (window.location.hash === next) {
    // Same route — just re-run the scroll behaviour.
    applyScroll(anchor);
    return;
  }
  window.location.hash = next;
}

/** Scroll to an anchor if given, otherwise to the top of the page. */
export function applyScroll(anchor?: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduce ? "auto" : "smooth";

  if (anchor) {
    // Wait a frame so the destination page has mounted.
    requestAnimationFrame(() => {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, behavior: "auto" });
    });
  } else {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

/** Anchor that routes internally and keeps external links safe. */
export function Link({
  to,
  anchor,
  children,
  className,
  onNavigate,
  ...rest
}: {
  to: string;
  anchor?: string;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const handle = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Respect modifier-clicks so "open in new tab" still works.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(to, anchor);
      onNavigate?.();
    },
    [to, anchor, onNavigate],
  );

  return (
    <a href={safeUrl(`#${to}`)} onClick={handle} className={className} {...rest}>
      {children}
    </a>
  );
}

