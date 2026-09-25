import { IMG } from "../data";
import { Link } from "../lib/router";
import Grab from "../sections/Grab";
import Members from "../sections/Members";
import { Arrow } from "../components/Icons";
import { GoldButton, PageHero } from "../components/ui";

export function OrderPage() {
  return (
    <>
      <PageHero
        eyebrow="IZ Grab"
        title="Skip"
        accent="the queue"
        copy="Build your bag, pick a branch, and we'll have it boxed and waiting. Contactless delivery across Dhaka, free over ৳1,500."
        image={IMG.freddo}
      />
      <Grab />
    </>
  );
}

export function ClubPage() {
  return (
    <>
      <PageHero
        eyebrow="IZ Club"
        title="Every tenth"
        accent="cup is ours"
        copy="Earn a point per ৳100, unlock early access to seasonal bakes, and get your birthday cake slice on the house."
        image={IMG.matcha}
      />
      <Members />
    </>
  );
}

export function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center bg-espresso-950 px-5 pt-28 text-center">
      <div>
        <p className="font-display text-[7rem] leading-none text-gold-500/25 sm:text-[10rem]">404</p>
        <h1 className="font-display -mt-6 text-3xl text-cream-50 sm:text-4xl">
          This page went out with the morning tray
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-cream-200/55">
          The link may be old, or we may have moved it. The counter is still open.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/">
            <GoldButton as="span">
              Back home
              <Arrow className="h-4 w-4" />
            </GoldButton>
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-200/22 px-7 py-3.5 text-[14px] text-cream-100 transition-colors hover:border-gold-400/70"
          >
            View the menu
          </Link>
        </div>
      </div>
    </section>
  );
}

