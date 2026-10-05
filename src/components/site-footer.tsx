import Link from "next/link";
import { ArrowUp } from "lucide-react";

import { Copy } from "@/components/content";
import { Container } from "@/components/section";
import {
  contact,
  isPlaceholder,
  navigation,
  plain,
  profile,
} from "@/content/portfolio";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const mailto =
    contact.email && !isPlaceholder(contact.email)
      ? `mailto:${contact.email}`
      : null;

  return (
    <footer className="border-stone-line/80 bg-alabaster/50 border-t">
      <Container className="py-14 sm:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/"
              className="group flex items-baseline gap-2.5"
              aria-label={`${plain(profile.name)} — back to top of home page`}
            >
              <span
                aria-hidden
                className="border-bronze-soft/70 group-hover:bg-bronze-soft/70 size-1.5 rotate-45 border transition-colors duration-500"
              />
              <span className="text-charcoal font-serif text-lg leading-none font-medium tracking-tight">
                <Copy value={profile.name} />
              </span>
            </Link>
            <p className="text-graphite mt-4 text-sm">
              {profile.role}
              {profile.location ? (
                <>
                  {" "}
                  · <Copy value={profile.location} />
                </>
              ) : null}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-8 gap-y-3 text-sm sm:gap-x-10"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-graphite hover:text-bronze transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
            {mailto ? (
              <a
                href={mailto}
                className="text-graphite hover:text-bronze transition-colors duration-300"
              >
                Email
              </a>
            ) : null}
          </nav>
        </div>

        <div className="border-stone-line/70 mt-12 flex flex-col-reverse items-start justify-between gap-5 border-t pt-7 sm:flex-row sm:items-center">
          <p className="text-graphite/80 text-xs">
            © {year} <Copy value={profile.name} />. Built with Next.js and
            hand-set type.
          </p>
          <Link
            href="#top"
            className="text-graphite hover:text-bronze group inline-flex items-center gap-2 text-xs transition-colors duration-300"
          >
            Back to top
            <ArrowUp
              aria-hidden
              className="ease-stone size-3.5 transition-transform duration-400 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
