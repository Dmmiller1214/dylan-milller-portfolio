import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import heroBust from "@/assets/sculptures/hero-bust.webp";
import { Copy } from "@/components/content";
import { Container } from "@/components/section";
import { Sculpture } from "@/components/sculpture";
import { Button } from "@/components/ui/button";
import { profile, projects } from "@/content/portfolio";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24"
    >
      {/* Warm light pooling behind the sculpture. Only on wide viewports, where
          the stone actually sits to the side of the type. */}
      <div
        aria-hidden
        className="from-accent/55 pointer-events-none absolute -top-40 right-[-14%] hidden h-[40rem] w-[40rem] rounded-full bg-radial-[at_50%_50%] via-transparent to-transparent blur-3xl lg:block"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 lg:pr-8">
            <p className="eyebrow animate-in fade-in slide-in-from-bottom-2 flex items-center gap-4 duration-700">
              <span aria-hidden className="bg-bronze-soft/70 h-px w-8" />
              {profile.role}
            </p>

            <h1
              id="hero-title"
              className="display-xl text-charcoal animate-in fade-in slide-in-from-bottom-3 mt-6 text-[clamp(2.75rem,10vw,5.5rem)] text-balance duration-900"
            >
              <Copy value={profile.name} />
            </h1>

            <p className="text-charcoal animate-in fade-in slide-in-from-bottom-3 font-serif mt-5 text-[clamp(1.375rem,3.4vw,1.875rem)] leading-snug font-normal text-balance duration-1000">
              <Copy value={profile.headline} />
            </p>

            <p className="text-graphite animate-in fade-in slide-in-from-bottom-3 measure mt-7 text-lg leading-relaxed duration-1000 sm:text-xl sm:leading-relaxed">
              <Copy value={profile.valueProposition} />
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-3 mt-10 flex flex-col gap-3 duration-1000 sm:flex-row sm:items-center sm:gap-4">
              <Button
                asChild
                className="bg-charcoal text-alabaster hover:bg-charcoal/88 group h-12 rounded-sm px-7 text-[0.9375rem] font-normal tracking-wide shadow-none"
              >
                <Link href="#work">
                  View my work
                  <ArrowDown
                    aria-hidden
                    className="ease-stone size-4 transition-transform duration-400 group-hover:translate-y-0.5"
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-stone-line text-charcoal hover:border-bronze-soft/60 hover:bg-accent/60 group h-12 rounded-sm bg-transparent px-7 text-[0.9375rem] font-normal tracking-wide"
              >
                <Link href="#contact">
                  Contact me
                  <ArrowUpRight
                    aria-hidden
                    className="ease-stone size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </Button>
            </div>

            <dl className="border-stone-line/80 text-graphite mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 border-t pt-7 text-sm">
              <div>
                <dt className="sr-only">Selected projects</dt>
                <dd className="flex items-baseline gap-2">
                  <span className="text-charcoal font-serif text-2xl leading-none">
                    {projects.length}
                  </span>
                  <span>selected projects</span>
                </dd>
              </div>
              {profile.location ? (
                <div className="flex items-baseline gap-2">
                  <dt>Based in</dt>
                  <dd className="text-charcoal">
                    <Copy value={profile.location} />
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="lg:col-span-5">
            {/* A gallery mount: hairline bronze rule enclosing the stone, with
                a deeper margin below so it sits optically centred. */}
            <div className="relative mx-auto w-[min(24rem,76%)] lg:w-full">
              <div
                aria-hidden
                className="border-bronze-soft/30 absolute -inset-x-5 -top-5 -bottom-9 border sm:-inset-x-7 sm:-top-7 sm:-bottom-12"
              />
              <Sculpture
                src={heroBust}
                priority
                drift={36}
                sizes="(min-width: 1024px) 38vw, (min-width: 640px) 60vw, 76vw"
                className="relative"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
