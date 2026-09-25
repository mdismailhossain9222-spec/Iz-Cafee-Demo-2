import { ARTICLES, BRAND, BRANCHES, MENU } from "../data";

/**
 * SEO repair layer.
 *
 * Bugs found on the live iz.cafe build and fixed here:
 *  1. og:url + schema url pointed at https://izpatisserie.com — that domain
 *     does not resolve (DNS failure). Now https://iz.cafe.
 *  2. No <link rel="canonical"> at all.
 *  3. schema telephone was the placeholder +8801234567890.
 *  4. schema "@id" was an empty string (invalid).
 *  5. Only 1 of 3 branches described; address was just "Gulshan 2".
 *  6. og:image + schema image were hotlinked Unsplash stock photos.
 *  7. potentialAction pointed at grab.izcafe.com — also does not resolve.
 *  8. No Twitter card, no og:locale, no theme-color, no robots directive.
 *  9. No aggregateRating despite 522 public reviews.
 * 10. Deprecated <meta name="keywords"> (ignored by every major engine).
 * 11. Empty #root with no <noscript> fallback for crawlers / JS-off users.
 */

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

const TITLE = "IZ Pâtisserie & Café | Artisanal Pastries & Specialty Coffee in Dhaka";
const DESC =
  "Award-loved patisserie and specialty coffee house in Dhaka. Laminated pastries baked every morning, single-origin espresso, and all-day brunch across Gulshan 2, Dhanmondi and Mirpur 12.";

export function applySeo(ogImage: string) {
  document.title = TITLE;
  document.documentElement.lang = "en";

  upsertMeta("name", "description", DESC);
  upsertMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1");
  upsertMeta("name", "theme-color", "#1A120B");
  upsertMeta("name", "author", BRAND.name);
  upsertMeta("name", "format-detection", "telephone=yes");

  // Canonical — was entirely missing.
  upsertLink("canonical", `${BRAND.domain}/`);

  // Open Graph — corrected domain.
  upsertMeta("property", "og:site_name", BRAND.name);
  upsertMeta("property", "og:title", TITLE);
  upsertMeta("property", "og:description", DESC);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:url", `${BRAND.domain}/`);
  upsertMeta("property", "og:locale", "en_US");
  upsertMeta("property", "og:locale:alternate", "bn_BD");
  upsertMeta("property", "og:image", ogImage);
  upsertMeta("property", "og:image:width", "1200");
  upsertMeta("property", "og:image:height", "630");
  upsertMeta("property", "og:image:alt", "IZ Pâtisserie & Café pastry counter in Dhaka");

  // Twitter — was entirely missing.
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", TITLE);
  upsertMeta("name", "twitter:description", DESC);
  upsertMeta("name", "twitter:image", ogImage);

  // Drop the deprecated keywords tag if the old build left one behind.
  document.head.querySelector('meta[name="keywords"]')?.remove();

  injectJsonLd(ogImage);
}

function injectJsonLd(image: string) {
  document.querySelectorAll('script[data-seo="iz"]').forEach((n) => n.remove());

  const graph: unknown[] = [
    {
      "@type": "Organization",
      "@id": `${BRAND.domain}/#organization`,
      name: BRAND.name,
      url: `${BRAND.domain}/`,
      logo: image,
      email: BRAND.email,
      sameAs: [BRAND.instagram, BRAND.facebook],
    },
    {
      "@type": "WebSite",
      "@id": `${BRAND.domain}/#website`,
      url: `${BRAND.domain}/`,
      name: BRAND.name,
      publisher: { "@id": `${BRAND.domain}/#organization` },
      inLanguage: "en",
    },
    // One fully-described CafeOrCoffeeShop node per real branch.
    ...BRANCHES.map((b) => ({
      "@type": "CafeOrCoffeeShop",
      "@id": `${BRAND.domain}/#${b.id}`,
      name: `${BRAND.name} — ${b.area}`,
      image,
      url: `${BRAND.domain}/`,
      telephone: b.phone,
      priceRange: "৳৳",
      servesCuisine: ["Coffee", "Patisserie", "Brunch"],
      currenciesAccepted: "BDT",
      parentOrganization: { "@id": `${BRAND.domain}/#organization` },
      address: {
        "@type": "PostalAddress",
        streetAddress: b.address,
        addressLocality: "Dhaka",
        addressRegion: "Dhaka Division",
        addressCountry: "BD",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "23:00",
      },
      ...(b.flagship
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: BRAND.rating,
              reviewCount: BRAND.reviewCount,
              bestRating: 5,
            },
          }
        : {}),
      hasMenu: {
        "@type": "Menu",
        name: "IZ Menu",
        hasMenuSection: ["Coffee", "Pastry", "Dessert"].map((section) => ({
          "@type": "MenuSection",
          name: section,
          hasMenuItem: MENU.filter((m) => m.category === section).map((m) => ({
            "@type": "MenuItem",
            name: m.name,
            description: m.notes,
            offers: {
              "@type": "Offer",
              price: m.price,
              priceCurrency: "BDT",
            },
          })),
        })),
      },
      sameAs: [BRAND.instagram, BRAND.facebook],
    })),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BRAND.domain}/` },
        { "@type": "ListItem", position: 2, name: "Menu", item: `${BRAND.domain}/#menu` },
        { "@type": "ListItem", position: 3, name: "Locations", item: `${BRAND.domain}/#locations` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Where is IZ Pâtisserie & Café located in Dhaka?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "IZ has three branches: Gulshan 2 (Concord Baksh Tower, Road 48), Dhanmondi (Concord Sohel Square, 75 Satmasjid Road) and Mirpur 12 (Safura Tower, Road 7).",
          },
        },
        {
          "@type": "Question",
          name: "What are IZ Pâtisserie & Café opening hours?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All branches are open daily from 8:00 AM to 11:00 PM.",
          },
        },
        {
          "@type": "Question",
          name: "Does IZ deliver in Dhaka?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. IZ Grab offers contactless delivery and takeout across Dhaka from all three branches.",
          },
        },
      ],
    },
  ];

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.seo = "iz";
  script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  document.head.appendChild(script);
}

/* ------------------------------------------------------------------ */
/* Per-route metadata                                                  */
/* ------------------------------------------------------------------ */

type RouteMeta = { title: string; description: string };

const ROUTE_META: Record<string, RouteMeta> = {
  "/": { title: TITLE, description: DESC },
  "/menu": {
    title: "Menu & Prices | IZ Pâtisserie & Café Dhaka",
    description:
      "The full IZ menu: specialty coffee, ceremonial matcha, laminated pastries, desserts and all-day brunch, with BDT prices and dietary tags for every item.",
  },
  "/craft": {
    title: "Our Craft — 72 Layers & an 18-Hour Ferment | IZ Pâtisserie & Café",
    description:
      "How IZ makes pastry: three book folds, seventy-two layers, eighteen hours of cold fermentation, and espresso dialled daily against Dhaka humidity.",
  },
  "/locations": {
    title: "Locations — Gulshan 2, Dhanmondi & Mirpur 12 | IZ Pâtisserie & Café",
    description:
      "Addresses, phone numbers, opening hours, parking and amenities for all three IZ Pâtisserie & Café branches in Dhaka. Open daily 8 AM – 11 PM.",
  },
  "/journal": {
    title: "The Journal — Notes from the Bench | IZ Pâtisserie & Café",
    description:
      "Short essays on lamination, espresso extraction, cold fermentation and how to order at a specialty café, written by the IZ pastry and coffee team.",
  },
  "/reserve": {
    title: "Reserve a Table | IZ Pâtisserie & Café Dhaka",
    description:
      "Book a table at IZ Gulshan 2, Dhanmondi or Mirpur 12. Choose your date, time and party size — tables held fifteen minutes past your slot.",
  },
  "/order": {
    title: "IZ Grab — Order Online for Delivery in Dhaka | IZ Pâtisserie & Café",
    description:
      "Order pastries and coffee for contactless delivery or pickup across Dhaka. Free delivery over ৳1,500 from all three IZ branches.",
  },
  "/club": {
    title: "IZ Club — Loyalty & Rewards | IZ Pâtisserie & Café",
    description:
      "Join IZ Club: earn a point per ৳100 spent, unlock early access to seasonal bakes, and get a birthday slice on the house.",
  },
};

/** Update title/description/canonical when the hash route changes. */
export function seoForRoute(path: string) {
  let meta = ROUTE_META[path];

  if (!meta && path.startsWith("/journal/")) {
    const slug = path.split("/")[2];
    const article = ARTICLES.find((a) => a.slug === slug);
    if (article) {
      meta = {
        title: `${article.title} | IZ Journal`,
        description: article.excerpt,
      };
      injectArticleLd(article.slug);
    }
  }

  if (!meta) {
    meta = { title: `Page not found | ${BRAND.name}`, description: DESC };
    upsertMeta("name", "robots", "noindex, follow");
  } else {
    upsertMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1");
  }

  document.title = meta.title;
  upsertMeta("name", "description", meta.description);
  upsertMeta("property", "og:title", meta.title);
  upsertMeta("property", "og:description", meta.description);
  upsertMeta("name", "twitter:title", meta.title);
  upsertMeta("name", "twitter:description", meta.description);

  const canonical = path === "/" ? `${BRAND.domain}/` : `${BRAND.domain}/#${path}`;
  upsertLink("canonical", canonical);
  upsertMeta("property", "og:url", canonical);

  if (!path.startsWith("/journal/")) {
    document.querySelectorAll('script[data-seo="article"]').forEach((n) => n.remove());
  }
}

/** Article-level BlogPosting schema, added only on article routes. */
function injectArticleLd(slug: string) {
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return;
  document.querySelectorAll('script[data-seo="article"]').forEach((n) => n.remove());

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.seo = "article";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt,
    datePublished: a.date,
    articleSection: a.category,
    wordCount: a.body.join(" ").split(/\s+/).length,
    inLanguage: "en",
    mainEntityOfPage: `${BRAND.domain}/#/journal/${a.slug}`,
    author: { "@type": "Organization", name: BRAND.name },
    publisher: { "@id": `${BRAND.domain}/#organization` },
  });
  document.head.appendChild(script);
}
