type P = { className?: string };
const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const Cup = (p: P) => (
  <svg {...s} {...p}>
    <path d="M4 8h13v6.5a5.5 5.5 0 0 1-5.5 5.5h-2A5.5 5.5 0 0 1 4 14.5V8Z" />
    <path d="M17 10h2.2a2.8 2.8 0 0 1 0 5.6H17" />
    <path d="M7.5 5c.7-.9.7-1.6 0-2.5M11 5c.7-.9.7-1.6 0-2.5" />
  </svg>
);

export const Croissant = (p: P) => (
  <svg {...s} {...p}>
    <path d="M3 14c3.5 3.5 14.5 3.5 18 0-1.5-5-5-8-9-8s-7.5 3-9 8Z" />
    <path d="M8 7.5 9.5 13M16 7.5 14.5 13M12 6v7" />
  </svg>
);

export const Pin = (p: P) => (
  <svg {...s} {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const Phone = (p: P) => (
  <svg {...s} {...p}>
    <path d="M6.5 3h3l1.5 4-2 1.4a12 12 0 0 0 5.6 5.6L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3h1Z" />
  </svg>
);

export const Clock = (p: P) => (
  <svg {...s} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 1.9" />
  </svg>
);

export const Arrow = (p: P) => (
  <svg {...s} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Star = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="m12 2.6 2.7 5.9 6.3.7-4.7 4.3 1.3 6.3L12 16.6l-5.6 3.2 1.3-6.3L3 9.2l6.3-.7L12 2.6Z" />
  </svg>
);

export const Lock = (p: P) => (
  <svg {...s} {...p}>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 1 1 8 0v3" />
  </svg>
);

export const Shield = (p: P) => (
  <svg {...s} {...p}>
    <path d="M12 3 5 6v5.5c0 4.3 3 8.2 7 9.5 4-1.3 7-5.2 7-9.5V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const Bag = (p: P) => (
  <svg {...s} {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 1 1 6 0v2" />
  </svg>
);

export const Spark = (p: P) => (
  <svg {...s} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
  </svg>
);

export const Leaf = (p: P) => (
  <svg {...s} {...p}>
    <path d="M4 20c0-8 5-14 16-15 0 11-5 15-11 15-2.5 0-5-1-5 0Z" />
    <path d="M9 15c2-3 5-5.5 8-7" />
  </svg>
);
