import {
  Accessibility,
  Cloud,
  Code2,
  Gauge,
  Layers,
  Palette,
  PenTool,
  Smartphone,
  Sparkles,
} from "lucide-react";

import drapery from "@/assets/sculptures/fragment-drapery.webp";
import { Copy } from "@/components/content";
import { Reveal } from "@/components/reveal";
import { Container, Section, SectionHeading } from "@/components/section";
import { Sculpture } from "@/components/sculpture";
import { practices, skillGroups, skillsIntro } from "@/content/portfolio";

const PRACTICE_ICONS = [Smartphone, Accessibility, Gauge, Sparkles] as const;

const GROUP_ICONS = {
  Languages: Code2,
  Frameworks: Layers,
  Styling: Palette,
  "Development and design tools": PenTool,
  "Services and deployment": Cloud,
} as const;

export function Skills() {
  return (
    <Section id="skills" className="relative overflow-hidden">
      {/* Carved drapery washed into the background as a section transition. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-30"
      >
        <Sculpture
          variant="band"
          src={drapery}
          drift={56}
          sizes="100vw"
        />
      </div>

      <Container>
        <SectionHeading
          id="skills"
          eyebrow="Skills"
          title="What I build with, and what I build for"
          intro={<Copy value={skillsIntro} />}
        />

        <ul className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2">
          {skillGroups.map((group, index) => {
            const Icon = GROUP_ICONS[group.title as keyof typeof GROUP_ICONS] ?? Code2;
            return (
              <Reveal
                as="li"
                key={group.title}
                delay={index * 60}
                className={
                  index === skillGroups.length - 1 ? "sm:col-span-2" : undefined
                }
              >
                <article
                  aria-labelledby={`skill-group-${index}`}
                  className="border-stone-line/80 bg-alabaster/50 h-full border p-7 sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className="border-bronze-soft/30 text-bronze flex size-10 shrink-0 items-center justify-center rounded-full border"
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <h3
                        id={`skill-group-${index}`}
                        className="text-charcoal font-serif text-xl leading-snug font-normal text-balance"
                      >
                        {group.title}
                      </h3>
                      {group.summary ? (
                        <p className="text-graphite mt-2 text-sm leading-relaxed">
                          <Copy value={group.summary} />
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border-stone-line bg-ivory text-charcoal rounded-sm border px-3 py-1.5 text-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-20 sm:mt-24">
          <Reveal>
            <h3 className="eyebrow">How I approach the work</h3>
          </Reveal>

          <ul className="mt-8 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            {practices.map((practice, index) => {
              const Icon = PRACTICE_ICONS[index] ?? Sparkles;
              return (
                <Reveal
                  as="li"
                  key={practice.title}
                  delay={index * 70}
                  className="bg-alabaster/70 border-stone-line/70 group hover:bg-alabaster border p-7 transition-colors duration-500 sm:p-8"
                >
                  <span
                    aria-hidden
                    className="border-bronze-soft/30 text-bronze group-hover:border-bronze-soft/60 flex size-10 items-center justify-center rounded-full border transition-colors duration-500"
                  >
                    <Icon className="size-4" />
                  </span>
                  <h4 className="text-charcoal mt-6 font-serif text-xl leading-snug font-normal">
                    {practice.title}
                  </h4>
                  <p className="text-graphite mt-3 text-sm leading-relaxed">
                    <Copy value={practice.description} />
                  </p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
