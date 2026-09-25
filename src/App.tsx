import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
// Social thumbnails perform better with food than with an empty room, so the
// pastry-counter shot stays as the og:image even though the hero is now the interior.
import ogImg from "./assets/Hero.jpg?inline";
import { ARTICLES } from "./data";
import { CartProvider } from "./lib/cart";
import { applySeo, seoForRoute } from "./lib/seo";
import { applyScroll, useRoute } from "./lib/router";
import { ToastProvider } from "./lib/toast";
import CartDrawer from "./components/CartDrawer";
import PageTransition from "./components/PageTransition";
import Nav from "./sections/Nav";
import Footer from "./sections/Footer";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import CraftPage from "./pages/CraftPage";
import LocationsPage from "./pages/LocationsPage";
import { ArticlePage, JournalPage } from "./pages/JournalPage";
import ReservePage from "./pages/ReservePage";
import { ClubPage, NotFound, OrderPage } from "./pages/Simple";

export default function App() {
  const route = useRoute();
  const [cartOpen, setCartOpen] = useState(false);

  // Base structured data + defaults, once.
  useEffect(() => {
    applySeo(ogImg);
  }, []);

  // Per-route title, description and canonical; then scroll handling.
  useEffect(() => {
    seoForRoute(route.path);
    applyScroll(route.hashTarget);
  }, [route.path, route.hashTarget]);

  return (
    <ToastProvider>
      <CartProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-gold-400 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-espresso-950"
        >
          Skip to content
        </a>

        <Nav onOpenCart={() => setCartOpen(true)} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

        <main id="main">
          <AnimatePresence mode="wait">
            <PageTransition key={route.path}>
              <Page route={route.path} param={route.param} />
            </PageTransition>
          </AnimatePresence>
        </main>

        <Footer />
      </CartProvider>
    </ToastProvider>
  );
}

function Page({ route, param }: { route: string; param?: string }) {
  if (route === "/") return <Home />;
  if (route === "/menu") return <MenuPage />;
  if (route === "/craft") return <CraftPage />;
  if (route === "/locations") return <LocationsPage />;
  if (route === "/journal") return <JournalPage />;
  if (route.startsWith("/journal/")) {
    // Unknown slugs fall through to the article page's own empty state.
    return <ArticlePage slug={param} />;
  }
  if (route === "/reserve") return <ReservePage />;
  if (route === "/order") return <OrderPage />;
  if (route === "/club") return <ClubPage />;
  return <NotFound />;
}

/** Exposed for the SEO module so it can resolve article titles. */
export const ARTICLE_SLUGS = ARTICLES.map((a) => a.slug);
