"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";

import { Copy } from "@/components/content";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigation, profile } from "@/content/portfolio";
import { useScrolledPast } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const SECTION_IDS = navigation.map((item) => item.href.split("#")[1]);

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lifted = useScrolledPast(24);
  const destination = useRef<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  /**
   * Closing the sheet must never move the page. The dialog restores focus to
   * the trigger on its way out, and because the trigger lives in a sticky bar
   * the browser scrolls to where that bar sits in the document rather than
   * where it is painted — jumping the reader hundreds of pixels back up the
   * page. So focus is always restored here by hand, with scrolling suppressed:
   * to the destination heading when a navigation link closed the sheet, and
   * back to the trigger otherwise.
   */
  const onSheetCloseAutoFocus = (event: Event) => {
    const id = destination.current;
    destination.current = null;
    event.preventDefault();

    const section = id ? document.getElementById(id) : null;
    if (!section) {
      trigger.current?.focus({ preventScroll: true });
      return;
    }

    const heading = section.querySelector("h2") ?? section;
    heading.setAttribute("tabindex", "-1");
    (heading as HTMLElement).focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!onHome) return;

    const sections = SECTION_IDS.map((id) =>
      document.getElementById(id),
    ).filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer whichever tracked section currently covers the most of the
        // viewport, so short sections don't win just by appearing first.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color] duration-500",
        // Solid once lifted. A translucent bar with a blurred backdrop let the
        // charcoal body copy passing underneath stay legible through the stone,
        // where it collided with the wordmark and the navigation.
        lifted
          ? "border-stone-line/80 bg-ivory border-b"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6 sm:h-20 sm:px-8">
        <Link
          href="/"
          className="group focus-visible:outline-bronze flex items-baseline gap-2.5"
        >
          <span
            aria-hidden
            className="border-bronze-soft/70 group-hover:bg-bronze-soft/70 size-1.5 rotate-45 border transition-colors duration-500"
          />
          <span className="text-charcoal font-serif text-lg leading-none font-medium tracking-tight sm:text-xl">
            <Copy value={profile.name} />
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const id = item.href.split("#")[1];
            const isActive = onHome && active === id;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "ease-stone relative rounded-sm px-3 py-2 text-sm transition-colors duration-300",
                  isActive
                    ? "text-charcoal"
                    : "text-graphite hover:text-charcoal",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "bg-bronze ease-stone absolute inset-x-3 bottom-1 h-px origin-left transition-transform duration-400",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-stone-line text-charcoal hover:border-bronze-soft/60 hover:bg-accent/70 ml-3 h-9 rounded-sm px-4 text-sm font-normal"
          >
            <Link href="/#contact">Get in touch</Link>
          </Button>
        </nav>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              ref={trigger}
              variant="ghost"
              size="icon"
              className="text-charcoal hover:bg-accent/70 size-10 rounded-sm md:hidden"
            >
              <Menu className="size-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            onCloseAutoFocus={onSheetCloseAutoFocus}
            className="bg-ivory border-stone-line w-[min(20rem,85vw)]"
          >
            <SheetHeader className="border-stone-line/70 border-b">
              <SheetTitle className="font-serif text-charcoal text-base font-medium">
                Navigation
              </SheetTitle>
            </SheetHeader>
            <nav aria-label="Primary" className="flex flex-col px-2 py-4">
              {navigation.map((item) => (
                <SheetClose key={item.href} asChild>
                  <Link
                    href={item.href}
                    onClick={() => {
                      destination.current = item.href.split("#")[1] ?? null;
                    }}
                    className="text-charcoal hover:bg-accent/60 rounded-sm px-4 py-3 font-serif text-xl transition-colors"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
