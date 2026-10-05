import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import hand from "@/assets/sculptures/fragment-hand.webp";
import { Copy } from "@/components/content";
import { ProjectFrame } from "@/components/project-frame";
import { Reveal } from "@/components/reveal";
import { Container, SectionRule } from "@/components/section";
import { Sculpture } from "@/components/sculpture";
import { ProjectLiveLink, ProjectSourceLink } from "@/components/sections/selected-work";
import { TechList } from "@/components/tech-list";
import { plain, projects } from "@/content/portfolio";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: plain(project.name),
    description: plain(project.description),
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const { detail } = project;

  return (
    <article className="pt-10 pb-24 sm:pt-14 sm:pb-32">
      <Container>
        <Link
          href="/#work"
          className="text-graphite hover:text-bronze group inline-flex items-center gap-2 text-sm transition-colors duration-300"
        >
          <ArrowLeft
            aria-hidden
            className="ease-stone size-3.5 transition-transform duration-400 group-hover:-translate-x-0.5"
          />
          All work
        </Link>

        <header className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4">
              <span aria-hidden className="bg-bronze-soft/70 h-px w-8" />
              Project {String(index + 1).padStart(2, "0")} of{" "}
              {String(projects.length).padStart(2, "0")}
            </p>
            <h1 className="display-xl text-charcoal mt-6 text-[clamp(2.25rem,7vw,4rem)] text-balance">
              <Copy value={project.name} />
            </h1>
            <p className="text-graphite measure mt-6 text-lg leading-relaxed">
              <Copy value={project.description} />
            </p>
          </div>

          <dl className="border-stone-line/80 space-y-6 border-t pt-7 text-sm lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-2 lg:pl-10">
            {project.role ? (
              <div>
                <dt className="eyebrow">My role</dt>
                <dd className="text-graphite mt-2 leading-relaxed">
                  <Copy value={project.role} />
                </dd>
              </div>
            ) : null}
            {project.technologies.length > 0 ? (
              <div>
                <dt className="eyebrow">Technologies</dt>
                <dd className="mt-2.5">
                  <TechList items={project.technologies} />
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="eyebrow sr-only">Links</dt>
              <dd className="flex flex-wrap items-center gap-3">
                <ProjectLiveLink project={project} prominent />
                <ProjectSourceLink project={project} />
              </dd>
            </div>
          </dl>
        </header>

        <Reveal className="mt-14 sm:mt-16">
          <ProjectFrame
            project={project}
            priority
            sizes="(min-width: 1280px) 72rem, 100vw"
          />
        </Reveal>

        {detail.results.length > 0 ? (
          <Reveal className="mt-16">
            <h2 className="eyebrow">Results</h2>
            <dl className="border-stone-line/80 mt-5 grid gap-px border-t pt-8 sm:grid-cols-3">
              {detail.results.map((result) => (
                <div key={result.label}>
                  <dd className="text-charcoal font-serif text-4xl leading-none font-light">
                    {result.value}
                  </dd>
                  <dt className="text-graphite mt-3 text-sm">{result.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {detail.problem || detail.approach ? (
          <div className="mt-20 grid gap-12 sm:mt-24 lg:grid-cols-12 lg:gap-14">
            {detail.problem ? (
              <Reveal className="lg:col-span-6">
                <h2 className="eyebrow">The problem</h2>
                <p className="text-graphite mt-5 leading-[1.8]">
                  <Copy value={detail.problem} />
                </p>
              </Reveal>
            ) : null}
            {detail.approach ? (
              <Reveal delay={80} className="lg:col-span-6">
                <h2 className="eyebrow">My approach</h2>
                <p className="text-graphite mt-5 leading-[1.8]">
                  <Copy value={detail.approach} />
                </p>
              </Reveal>
            ) : null}
          </div>
        ) : null}

        {detail.keyFeatures.length > 0 ? (
          <Reveal className="mt-20 sm:mt-24">
            <h2 className="eyebrow">Key features</h2>
            <ul className="mt-6 grid gap-x-12 sm:grid-cols-2">
              {detail.keyFeatures.map((feature, featureIndex) => (
                <li
                  key={`${feature}-${featureIndex}`}
                  className="border-stone-line-soft text-charcoal flex gap-4 border-b py-4 leading-relaxed"
                >
                  <span className="text-bronze/70 shrink-0 font-mono text-xs leading-7">
                    {String(featureIndex + 1).padStart(2, "0")}
                  </span>
                  <Copy value={feature} />
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        {detail.challenges.length > 0 ? (
          <Reveal className="mt-20 sm:mt-24">
            <h2 className="eyebrow">Challenges solved</h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 sm:gap-10">
              {detail.challenges.map((challenge, challengeIndex) => (
                <div
                  key={`${challenge.title}-${challengeIndex}`}
                  className="border-stone-line/80 bg-alabaster/60 border p-7 sm:p-8"
                >
                  <h3 className="text-charcoal font-serif text-xl leading-snug font-normal">
                    <Copy value={challenge.title} />
                  </h3>
                  <p className="text-graphite mt-3 text-[0.9375rem] leading-relaxed">
                    <Copy value={challenge.body} />
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}

        <SectionRule className="mt-24" />

        <div className="relative mt-16 overflow-hidden py-10">
          {/* A carved hand resting at the right of the onward link. Sized to sit
              wholly inside the box, so the clip never cuts a hard edge. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 right-0 -z-10 hidden w-[20rem] opacity-35 lg:block"
          >
            <Sculpture src={hand} drift={26} sizes="20rem" />
          </div>
          <Reveal>
            <p className="eyebrow">Next project</p>
            <Link
              href={`/work/${next.slug}`}
              className="group focus-visible:outline-bronze mt-4 inline-flex items-center gap-5"
            >
              <span className="display-xl text-charcoal group-hover:text-bronze text-3xl transition-colors duration-400 sm:text-5xl">
                <Copy value={next.name} />
              </span>
              <ArrowRight
                aria-hidden
                className="text-bronze ease-stone size-6 shrink-0 transition-transform duration-400 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </Container>
    </article>
  );
}
