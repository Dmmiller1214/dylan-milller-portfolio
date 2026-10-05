import Image from "next/image";

import profileRelief from "@/assets/sculptures/fragment-profile.webp";
import { Copy } from "@/components/content";
import { Reveal } from "@/components/reveal";
import { Container, Section, SectionHeading } from "@/components/section";
import { Sculpture } from "@/components/sculpture";
import { about } from "@/content/portfolio";

export function About() {
  return (
    <Section id="about" className="relative">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              id="about"
              eyebrow="About"
              title={`A little about me`}
            />

            <div className="mt-10 space-y-6">
              {about.paragraphs.map((paragraph, index) => (
                <Reveal key={index} delay={index * 80}>
                  <p className="text-graphite measure text-base leading-[1.8] sm:text-[1.0625rem]">
                    <Copy value={paragraph} />
                  </p>
                </Reveal>
              ))}
            </div>

            {about.interests.length > 0 ? (
              <Reveal delay={160} className="mt-12">
                <h3 className="eyebrow">Outside the editor</h3>
                <ul className="text-graphite mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  {about.interests.map((interest, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {index > 0 ? (
                        <span
                          aria-hidden
                          className="bg-bronze-soft/50 size-1 rotate-45"
                        />
                      ) : null}
                      <Copy value={interest} />
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>

          <Reveal delay={120} className="lg:col-span-5">
            <figure className="mx-auto w-[min(21rem,78%)] lg:mr-0 lg:w-full">
              <div className="relative">
                <div
                  aria-hidden
                  className="border-bronze-soft/30 absolute -inset-x-5 -top-5 -bottom-8 border sm:-inset-x-6 sm:-top-6 sm:-bottom-10"
                />
                {about.portrait ? (
                  <Image
                    src={about.portrait.src}
                    alt={about.portrait.alt}
                    width={720}
                    height={900}
                    sizes="(min-width: 1024px) 34vw, 70vw"
                    className="border-stone-line relative aspect-4/5 w-full border object-cover"
                  />
                ) : (
                  <Sculpture
                    src={profileRelief}
                    drift={28}
                    sizes="(min-width: 1024px) 34vw, 70vw"
                    className="relative"
                  />
                )}
              </div>
              <figcaption className="text-graphite/75 mt-12 text-xs leading-relaxed sm:mt-14">
                {about.portrait
                  ? about.portrait.alt
                  : "Marble relief, used here as a stand-in until a portrait is supplied."}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
