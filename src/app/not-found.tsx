import Link from "next/link";

import hand from "@/assets/sculptures/fragment-hand.webp";
import { Container } from "@/components/section";
import { Sculpture } from "@/components/sculpture";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 -z-10 w-[min(34rem,70%)] opacity-35"
      >
        <Sculpture src={hand} drift={24} sizes="(min-width: 640px) 34rem, 70vw" />
      </div>
      <Container>
        <p className="eyebrow flex items-center gap-4">
          <span aria-hidden className="bg-bronze-soft/70 h-px w-8" />
          404
        </p>
        <h1 className="display-xl text-charcoal mt-6 text-[clamp(2.25rem,7vw,4rem)]">
          Nothing carved here
        </h1>
        <p className="text-graphite measure mt-5 text-lg leading-relaxed">
          This page does not exist, or the fragment has been lost. The work is
          all still on the home page.
        </p>
        <Button
          asChild
          className="bg-charcoal text-alabaster hover:bg-charcoal/88 mt-9 h-12 rounded-sm px-7 text-[0.9375rem] font-normal tracking-wide shadow-none"
        >
          <Link href="/">Back to the portfolio</Link>
        </Button>
      </Container>
    </section>
  );
}
