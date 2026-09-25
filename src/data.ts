import cruffin from "./assets/cruffin.jpg?inline";
import freddo from "./assets/freddo.jpg?inline";
import cheesecake from "./assets/cheesecake.jpg?inline";
import brunch from "./assets/brunch.jpg?inline";
import matcha from "./assets/matcha.jpg?inline";
import barista from "./assets/barista.jpg?inline";
import interior from "./assets/interior.jpg?inline";
import counter from "./assets/hero.jpg?inline";

export const IMG = { cruffin, freddo, cheesecake, brunch, matcha, barista, interior, counter };

/**
 * Business data cross-checked against the brand's public listings (Facebook,
 * Google/mindtrip, creator menu posts). The live site shipped a placeholder
 * phone number (+8801234567890) and described only one of three branches.
 */

export const BRAND = {
  name: "IZ Pâtisserie & Café",
  shortName: "IZ",
  tagline: "Caffeine & Kindness",
  domain: "https://iz.cafe",
  email: "info@iz.cafe",
  instagram: "https://www.instagram.com/izpatisserieandcafe/",
  facebook: "https://www.facebook.com/IZPatisserieandCafe",
  rating: 4.5,
  reviewCount: 522,
};

/* ------------------------------------------------------------------ */
/* Branches                                                            */
/* ------------------------------------------------------------------ */

export type Branch = {
  id: string;
  area: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  hours: string;
  maps: string;
  image: string;
  flagship?: boolean;
  seats: number;
  opened: string;
  bestFor: string;
  amenities: string[];
  note: string;
};

export const BRANCHES: Branch[] = [
  {
    id: "gulshan",
    area: "Gulshan 2",
    address: "Concord Baksh Tower, House 11/A, Road 48, Dhaka 1212",
    phone: "+8801329731723",
    phoneDisplay: "01329 731723",
    hours: "8:00 AM – 11:00 PM · Daily",
    maps: "https://www.google.com/maps/search/?api=1&query=IZ+Patisserie+Cafe+Gulshan+2+Dhaka",
    image: interior,
    flagship: true,
    seats: 72,
    opened: "2023",
    bestFor: "Long work sessions & evening catch-ups",
    amenities: ["Fibre Wi-Fi", "Power at every seat", "Street parking", "Lounge seating", "Private nook"],
    note: "The flagship. Full pastry counter, the widest coffee menu, and the only branch with the lounge mezzanine.",
  },
  {
    id: "dhanmondi",
    area: "Dhanmondi",
    address: "Concord Sohel Square, Level 5, 75 Satmasjid Road, Dhaka 1209",
    phone: "+8801335259229",
    phoneDisplay: "01335 259229",
    hours: "8:00 AM – 11:00 PM · Daily",
    maps: "https://www.google.com/maps/search/?api=1&query=IZ+Patisserie+Cafe+Dhanmondi+Satmasjid+Road",
    image: brunch,
    seats: 58,
    opened: "2025",
    bestFor: "Weekend brunch & student study hours",
    amenities: ["Fibre Wi-Fi", "Mall parking", "Family seating", "High chairs", "Brunch till 4 PM"],
    note: "Our brunch-forward room. Bright, high-ceilinged, and the busiest kitchen of the three on a Friday.",
  },
  {
    id: "mirpur",
    area: "Mirpur 12",
    address: "Safura Tower, Road 7, Mirpur 12, Dhaka 1216",
    phone: "+8801770024245",
    phoneDisplay: "01770 024245",
    hours: "8:00 AM – 11:00 PM · Daily",
    maps: "https://www.google.com/maps/search/?api=1&query=IZ+Patisserie+Cafe+Mirpur+12+Safura+Tower",
    image: barista,
    seats: 44,
    opened: "2025",
    bestFor: "Quick espresso & takeaway boxes",
    amenities: ["Fibre Wi-Fi", "Dedicated parking", "Takeaway counter", "Outdoor terrace"],
    note: "Neighbourhood-scale and fast. Built around the bar, with a terrace that catches the evening breeze.",
  },
];

/* ------------------------------------------------------------------ */
/* Menu                                                                */
/* ------------------------------------------------------------------ */

export const CATEGORIES = ["Coffee", "Matcha & Tea", "Pastry", "Dessert", "Brunch"] as const;
export type Category = (typeof CATEGORIES)[number];

/** V = vegetarian · VG = vegan · GF = gluten-free · N = contains nuts */
export type Diet = "V" | "VG" | "GF" | "N";

export type MenuItem = {
  id: string;
  name: string;
  category: Category;
  price: number;
  priceLarge?: number;
  notes: string;
  detail: string;
  image: string;
  diet: Diet[];
  signature?: boolean;
  bestseller?: boolean;
};

export const MENU: MenuItem[] = [
  /* ---- Coffee ---- */
  {
    id: "hazelnut-freddo",
    name: "Hazelnut Cream Freddo",
    category: "Coffee",
    price: 490,
    priceLarge: 590,
    notes: "Whipped cold espresso under a hazelnut cream cap.",
    detail:
      "Two ristretto shots shaken over ice until aerated, then topped with a lightly sweetened hazelnut cream whipped to order. Balanced rather than sweet — the cream is there for texture, not sugar.",
    image: freddo,
    diet: ["V", "N"],
    signature: true,
    bestseller: true,
  },
  {
    id: "salted-caramel-latte",
    name: "Salted Caramel Latte",
    category: "Coffee",
    price: 460,
    notes: "House caramel, Himalayan salt, velvet microfoam.",
    detail:
      "Our caramel is cooked in-house every second morning to a deep amber, then cut with Himalayan pink salt so it finishes savoury instead of cloying.",
    image: freddo,
    diet: ["V"],
    bestseller: true,
  },
  {
    id: "caramel-latte",
    name: "Caramel Latte",
    category: "Coffee",
    price: 390,
    notes: "Slow-cooked caramel folded through espresso.",
    detail: "The unsalted original. Softer, rounder, and the one most people order on a second visit.",
    image: freddo,
    diet: ["V"],
  },
  {
    id: "iced-americano",
    name: "Iced Americano",
    category: "Coffee",
    price: 305,
    notes: "Double ristretto over Himalayan ice.",
    detail:
      "Poured long over slow-melt ice so it stays bright to the last sip. The cleanest way to taste whichever origin we are pouring this season.",
    image: freddo,
    diet: ["VG", "GF"],
  },
  {
    id: "flat-white",
    name: "Flat White",
    category: "Coffee",
    price: 350,
    notes: "Two ristretto shots, 4oz, dense microfoam.",
    detail:
      "Dialled every morning against the day's humidity. Served at 60°C so you can actually taste it rather than just feel it.",
    image: barista,
    diet: ["V"],
  },
  {
    id: "cold-brew",
    name: "18-Hour Cold Brew",
    category: "Coffee",
    price: 380,
    notes: "Steeped overnight, no heat, no bitterness.",
    detail:
      "Coarse-ground single origin steeped 18 hours at cellar temperature, then filtered twice. Naturally sweet with a cocoa finish.",
    image: freddo,
    diet: ["VG", "GF"],
  },

  /* ---- Matcha & Tea ---- */
  {
    id: "ceremonial-matcha",
    name: "Iced Ceremonial Matcha",
    category: "Matcha & Tea",
    price: 520,
    priceLarge: 620,
    notes: "First-harvest Uji matcha, whisked to order.",
    detail:
      "Ceremonial-grade first harvest, sifted and whisked by hand with a bamboo chasen, then layered over cold milk. Grassy and full, never chalky.",
    image: matcha,
    diet: ["V", "GF"],
    signature: true,
  },
  {
    id: "matcha-latte-hot",
    name: "Hot Matcha Latte",
    category: "Matcha & Tea",
    price: 470,
    notes: "The same whisk, steamed milk, no syrup.",
    detail: "Unsweetened by default — ask for honey at the counter if you prefer it rounded.",
    image: matcha,
    diet: ["V", "GF"],
  },
  {
    id: "earl-grey",
    name: "Bergamot Earl Grey",
    category: "Matcha & Tea",
    price: 280,
    notes: "Loose leaf, four-minute steep, served in glass.",
    detail: "A proper leaf tea with real bergamot oil, timed at the bar so it never turns tannic.",
    image: matcha,
    diet: ["VG", "GF"],
  },

  /* ---- Pastry ---- */
  {
    id: "biscoff-bomboloni",
    name: "Biscoff Bomboloni",
    category: "Pastry",
    price: 290,
    notes: "Proofed overnight, filled the moment you order.",
    detail:
      "An Italian-style filled doughnut, proofed cold for 18 hours then fried in small batches through the morning. Piped with Biscoff crème only once it reaches your ticket, so the shell stays crisp.",
    image: cruffin,
    diet: ["V"],
    signature: true,
    bestseller: true,
  },
  {
    id: "pistachio-cruffin",
    name: "Pistachio Cruffin",
    category: "Pastry",
    price: 340,
    notes: "72-layer lamination, Sicilian pistachio crème.",
    detail:
      "Croissant dough rolled into a muffin tin so it bakes into a spiral with a shatteringly crisp crown. Filled with a pistachio crème we grind ourselves.",
    image: cruffin,
    diet: ["V", "N"],
  },
  {
    id: "butter-croissant",
    name: "Pure Butter Croissant",
    category: "Pastry",
    price: 220,
    notes: "Three folds, 18-hour cold ferment.",
    detail:
      "The benchmark. Nothing but flour, water, salt, yeast and a great deal of butter. If this one is right, everything else on the shelf is right.",
    image: cruffin,
    diet: ["V"],
  },
  {
    id: "almond-danish",
    name: "Toasted Almond Danish",
    category: "Pastry",
    price: 310,
    notes: "Frangipane, flaked almonds, icing sugar.",
    detail: "Yesterday's croissants reborn the way the French intended — soaked, filled and baked again.",
    image: cruffin,
    diet: ["V", "N"],
  },
  {
    id: "cheese-sausage-bun",
    name: "Cheesy Sausage Bun",
    category: "Pastry",
    price: 260,
    notes: "Enriched milk dough, mozzarella, black pepper.",
    detail: "Soft milk-bread dough wrapped around a peppery sausage and baked under a cap of melted mozzarella.",
    image: cruffin,
    diet: [],
  },

  /* ---- Dessert ---- */
  {
    id: "basque",
    name: "Burnt Basque Cheesecake",
    category: "Dessert",
    price: 420,
    notes: "Scorched top, molten centre, 24-hour set.",
    detail:
      "Baked hot and fast until the top caramelises almost black, then rested a full day so the centre settles to a custard. Served at room temperature, never fridge-cold.",
    image: cheesecake,
    diet: ["V", "GF"],
    signature: true,
    bestseller: true,
  },
  {
    id: "brownie",
    name: "Dark Chocolate Brownie",
    category: "Dessert",
    price: 175,
    notes: "70% couverture, fudge centre, sea salt.",
    detail: "Dense rather than cakey, with a thin crackled top and flaked sea salt to cut the richness.",
    image: cheesecake,
    diet: ["V"],
  },
  {
    id: "tiramisu",
    name: "Espresso Tiramisu",
    category: "Dessert",
    price: 390,
    notes: "Mascarpone cream, our own espresso soak.",
    detail: "Built with the same shots we pull at the bar, so the coffee tastes like coffee and not like syrup.",
    image: cheesecake,
    diet: ["V"],
  },
  {
    id: "lemon-tart",
    name: "Lemon & Thyme Tart",
    category: "Dessert",
    price: 360,
    notes: "Sharp curd, torched meringue, sablé shell.",
    detail: "Properly sour. The thyme is infused into the curd overnight and reads as a savoury edge rather than a herb.",
    image: cheesecake,
    diet: ["V"],
  },

  /* ---- Brunch ---- */
  {
    id: "truffle-toast",
    name: "Truffle Mushroom Toast",
    category: "Brunch",
    price: 680,
    notes: "Sourdough, wild mushrooms, poached egg.",
    detail:
      "Slow-cooked mushrooms finished with truffle oil on toasted house sourdough, under a soft poached egg and shaved parmesan.",
    image: brunch,
    diet: ["V"],
    bestseller: true,
  },
  {
    id: "pancake-stack",
    name: "Buttermilk Pancake Stack",
    category: "Brunch",
    price: 620,
    notes: "Three tall, berries, whipped mascarpone.",
    detail: "Rested batter makes them tall and light. Choose strawberry with white chocolate, or banana with Bueno.",
    image: brunch,
    diet: ["V"],
  },
  {
    id: "smoked-salmon",
    name: "Smoked Salmon Plate",
    category: "Brunch",
    price: 790,
    notes: "Cream cheese, capers, dill, toasted rye.",
    detail: "Cold-smoked salmon with whipped cream cheese, salted capers and a sharp dill dressing.",
    image: brunch,
    diet: [],
  },
  {
    id: "avocado-toast",
    name: "Avocado & Chilli Toast",
    category: "Brunch",
    price: 560,
    notes: "Smashed avocado, lime, chilli crisp.",
    detail: "Bright and hot. Add a poached egg for ৳90 — most people do.",
    image: brunch,
    diet: ["VG"],
  },
];

export const DIET_LABEL: Record<Diet, string> = {
  V: "Vegetarian",
  VG: "Vegan",
  GF: "Gluten free",
  N: "Contains nuts",
};

/* ------------------------------------------------------------------ */
/* Story                                                               */
/* ------------------------------------------------------------------ */

export const CRAFT_STATS = [
  { value: "72", label: "lamination layers" },
  { value: "18h", label: "cold ferment" },
  { value: "3", label: "Dhaka ateliers" },
];

export const TIMELINE = [
  {
    year: "2022",
    title: "A single deck oven",
    body: "Two of us, one second-hand deck oven, and a stubborn idea that Dhaka deserved pastry that did not compromise.",
  },
  {
    year: "2023",
    title: "Gulshan 2 opens",
    body: "The flagship opens on Road 48 with a nine-item menu. The bomboloni sells out by 11 AM on day three.",
  },
  {
    year: "2024",
    title: "The coffee programme",
    body: "We bring roasting decisions in-house and start cupping every lot before it reaches the bar.",
  },
  {
    year: "2025",
    title: "Dhanmondi & Mirpur",
    body: "Two new rooms in one year — one built for brunch, one built around the espresso bar.",
  },
  {
    year: "2026",
    title: "522 reviews, 4.5 stars",
    body: "Still folding by hand. Still baking through the morning. Still selling out of the good stuff.",
  },
];

export const TEAM = [
  {
    name: "Ishrat Zaman",
    role: "Founder & Head Pastry Chef",
    bio: "Trained in laminated doughs and viennoiserie. Sets every recipe and still folds the first batch most mornings.",
    image: cruffin,
  },
  {
    name: "Rafiq Hasan",
    role: "Head of Coffee",
    bio: "Runs the cupping table and dials the bar daily. Believes a flat white should be drunk within ninety seconds.",
    image: barista,
  },
  {
    name: "Nusrat Jahan",
    role: "Pastry Sous Chef",
    bio: "Owns the overnight ferment and the dessert counter. The Basque cheesecake is hers, and she will not share the recipe.",
    image: cheesecake,
  },
];

export const PROCESS = [
  { step: "01", title: "Cup & select", body: "Every lot is cupped blind before it earns a place on the bar." },
  { step: "02", title: "Mix & rest", body: "Doughs are mixed cool and rested 18 hours to build flavour, not speed." },
  { step: "03", title: "Fold by hand", body: "Three book folds, seventy-two layers, no sheeter shortcuts." },
  { step: "04", title: "Bake in batches", body: "Small trays through the morning so the shelf is never more than an hour old." },
  { step: "05", title: "Finish to order", body: "Creams and fillings go in when your ticket prints, never before." },
];

/* ------------------------------------------------------------------ */
/* Journal                                                             */
/* ------------------------------------------------------------------ */

export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readMins: number;
  excerpt: string;
  image: string;
  body: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "seventy-two-layers",
    title: "Why seventy-two layers and not more",
    category: "Craft",
    date: "12 March 2026",
    readMins: 4,
    excerpt:
      "Everyone quotes a layer count. Almost nobody explains why past a certain point more folds make a worse croissant.",
    image: cruffin,
    body: [
      "A croissant is a laminated dough: alternating sheets of butter and dough, folded over themselves until the layers are thin enough to steam apart in the oven. The number everybody quotes is the layer count, and the assumption is that more is better. It is not.",
      "Three book folds give you seventy-two layers. At that count each butter sheet is still thick enough to hold its shape through proofing, so when the oven hits it the water in the butter flashes to steam and pushes the dough apart into distinct, visible leaves. That is the honeycomb you want to see when you tear one open.",
      "Push to four folds and you get well over two hundred layers — but each one is now so thin that the butter starts to merge into the dough. You lose the separation. The crumb goes fine and bready, the shatter disappears, and you have essentially made an expensive brioche.",
      "So we stop at three. The dough rests cold between each fold, which keeps the butter plastic rather than greasy and lets the gluten relax so the sheet does not fight back. It is slower. It is also the whole point.",
    ],
  },
  {
    slug: "dialling-for-humidity",
    title: "Dialling espresso for Dhaka humidity",
    category: "Coffee",
    date: "28 February 2026",
    readMins: 5,
    excerpt:
      "The same recipe that pulled beautifully in January will choke the basket in July. Here is what we change, and why.",
    image: barista,
    body: [
      "Coffee is hygroscopic — it pulls moisture out of the air. In a Dhaka monsoon, ground coffee starts absorbing humidity the moment it leaves the burr, and that changes how water moves through the puck.",
      "Damp grounds clump. Clumped grounds channel: water finds the path of least resistance, races through one part of the basket and barely touches the rest. You get a shot that is simultaneously sour and bitter, which is the specific failure mode that makes people think they dislike espresso.",
      "Our answer is not one adjustment but three. We grind slightly coarser to open the bed. We reduce the dose a gram or so to lower resistance. And we taste every hour rather than every shift, because a wet afternoon can undo a perfect morning.",
      "None of this is exotic. It is just attention. The bar log in each branch records the grind setting, dose and yield at every check, so the person opening tomorrow starts from what actually worked today rather than from a number written down in January.",
    ],
  },
  {
    slug: "what-cold-ferment-does",
    title: "What eighteen hours in the cold actually does",
    category: "Craft",
    date: "5 February 2026",
    readMins: 3,
    excerpt:
      "Cold fermentation is not about convenience. It is the difference between dough that tastes of yeast and dough that tastes of wheat.",
    image: cheesecake,
    body: [
      "Warm dough rises fast. Yeast multiplies, throws off carbon dioxide, and within a couple of hours you have something that looks ready. It is not ready — it is inflated.",
      "Drop the same dough to four degrees and everything slows. The yeast keeps working, barely, but the enzymes carry on breaking starches into simpler sugars and proteins into amino acids. Those are the compounds that brown and taste of something in the oven.",
      "Eighteen hours is where we land. Less and the flavour is thin. More and the gluten begins to degrade, the dough slackens, and the finished pastry spreads instead of rising.",
      "The practical cost is that everything we sell tomorrow has to be decided today. There is no way to catch up if we get the forecast wrong, which is exactly why the shelf occasionally empties by mid-afternoon.",
    ],
  },
  {
    slug: "reading-a-menu",
    title: "How to order at a specialty café without guessing",
    category: "Guide",
    date: "18 January 2026",
    readMins: 4,
    excerpt:
      "A short, unsnobbish guide to picking the right drink for what you actually want — strength, sweetness, or something to sit with.",
    image: freddo,
    body: [
      "Most café menus are organised for the people making the drinks, not the people drinking them. Here is a simpler way to think about it.",
      "If you want to taste the coffee itself, order something without milk: an americano hot or iced, or a cold brew if you want it softer and sweeter without sugar. These are where the origin actually comes through.",
      "If you want texture and comfort, order milk: a flat white for strength in a small cup, a latte for something longer and gentler. The only real difference is the ratio, not the quality.",
      "If you want a treat, order the freddo or a flavoured latte and enjoy it for what it is. Nobody at our bar will think less of you — sweetness is a legitimate thing to want, and the caramel is made here.",
      "And if you are unsure, say what you normally drink at home. That single sentence tells a barista more than any adjective on the board.",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Reservations & misc                                                 */
/* ------------------------------------------------------------------ */

export const TIME_SLOTS = [
  "08:30", "09:30", "10:30", "11:30", "12:30", "13:30",
  "14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30",
];

export const OCCASIONS = ["Casual visit", "Birthday", "Work session", "Date", "Family gathering"];

export const REVIEWS = [
  {
    quote:
      "The Hazelnut Cream Freddo is easily the best cold coffee in Dhaka. Super creamy, perfectly balanced, and never too sweet.",
    name: "Fabiha H.",
    role: "Food creator · Dhanmondi",
  },
  {
    quote:
      "Aesthetic interiors without sacrificing the food. The Basque cheesecake and the pastas both hold up — rare for a café here.",
    name: "Tanvir A.",
    role: "Google review · Gulshan 2",
  },
  {
    quote:
      "I come for the bomboloni and stay three hours. Staff never rush you, the wifi is solid, and it smells incredible.",
    name: "Sara K.",
    role: "Regular since 2024",
  },
];

export const FAQS = [
  {
    q: "Do you take reservations?",
    a: "Yes, for parties of two or more at any branch. Same-day requests are best made by phone; anything further out can go through the reservation form on this site.",
  },
  {
    q: "Is there parking?",
    a: "Mirpur 12 has dedicated parking, Dhanmondi uses the Concord Sohel Square mall parking, and Gulshan 2 relies on street parking along Road 48.",
  },
  {
    q: "Can I work from the café?",
    a: "Absolutely. All three branches have fibre Wi-Fi, and Gulshan 2 has power at every seat plus a quieter mezzanine.",
  },
  {
    q: "Do you cater events or do custom cakes?",
    a: "We do both, with about a week's notice for cakes and two weeks for event catering. Email info@iz.cafe with your date and headcount.",
  },
  {
    q: "Are there vegan or gluten-free options?",
    a: "Several. Every item on the menu page is tagged, and you can filter the full menu by dietary preference. Our kitchen is not allergen-free, so please tell staff about any allergy.",
  },
];

export const MARQUEE = [
  "Artisanal Pastries",
  "Specialty Coffee",
  "Caffeine & Kindness",
  "Baked Every Morning",
  "Gulshan · Dhanmondi · Mirpur",
];
