import { ArrowUpRight } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";

import torso from "@/assets/sculptures/fragment-torso.webp";
import { Copy } from "@/components/content";
import { Reveal } from "@/components/reveal";
import { Container, Section, SectionHeading } from "@/components/section";
import { Sculpture } from "@/components/sculpture";
import { Button } from "@/components/ui/button";
import { contact } from "@/content/portfolio";

type Channel = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

function buildChannels(): Channel[] {
  const channels: Channel[] = [];

  if (contact.github) {
    channels.push({
      label: "GitHub",
      href: contact.github,
      icon: GithubIcon,
    });
  }

  if (contact.linkedin) {
    channels.push({
      label: "LinkedIn",
      href: contact.linkedin,
      icon: LinkedinIcon,
    });
  }

  for (const item of contact.elsewhere) {
    channels.push({
      label: item.label,
      href: item.href,
      icon: ArrowUpRight,
    });
  }

  return channels;
}

export function Contact() {
  const channels = buildChannels();

  return (
    <Section id="contact" className="relative overflow-hidden pb-28 sm:pb-36">
      {/* Torso fragment settling into the corner beside the closing invitation,
          kept clear of the text column so nothing is read over stone. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[24rem] w-[min(34rem,70%)] opacity-25 sm:h-[28rem]"
      >
        <Sculpture
          variant="band"
          src={torso}
          drift={40}
          sizes="(min-width: 640px) 34rem, 70vw"
        />
      </div>

      <Container>
        <div className="max-w-2xl">
          <SectionHeading
            id="contact"
            eyebrow="Contact"
            title={contact.headline}
            intro={<Copy value={contact.invitation} />}
          />

          {contact.availability ? (
            <Reveal delay={80} className="mt-8">
              <p className="border-bronze-soft/40 text-graphite inline-flex items-center gap-2.5 border-l-2 py-1 pl-4 text-sm">
                <span
                  aria-hidden
                  className="bg-bronze-soft/70 size-1.5 rounded-full"
                />
                <Copy value={contact.availability} />
              </p>
            </Reveal>
          ) : null}

          <Reveal delay={100} className="mt-10 flex flex-col gap-3 sm:flex-row">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const isGithub = channel.label === "GitHub";
              return (
                <Button
                  key={channel.label}
                  asChild
                  variant={isGithub ? "default" : "outline"}
                  className={
                    isGithub
                      ? "bg-charcoal text-alabaster hover:bg-charcoal/88 group h-12 rounded-sm px-7 text-[0.9375rem] font-normal tracking-wide shadow-none"
                      : "border-stone-line text-charcoal hover:border-bronze-soft/60 hover:bg-accent/60 group h-12 rounded-sm bg-transparent px-7 text-[0.9375rem] font-normal tracking-wide"
                  }
                >
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Icon aria-hidden className="size-4" />
                    {channel.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                    <ArrowUpRight
                      aria-hidden
                      className="ease-stone size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </Button>
              );
            })}
          </Reveal>

          {contact.resumeUrl ? (
            <Reveal delay={140} className="mt-8">
              <Button
                asChild
                variant="outline"
                className="border-stone-line text-charcoal hover:border-bronze-soft/60 hover:bg-accent/60 h-12 rounded-sm bg-transparent px-7 text-[0.9375rem] font-normal tracking-wide"
              >
                <a href={contact.resumeUrl} download>
                  Download résumé
                </a>
              </Button>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
