import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";

import { GithubIcon } from "@/components/brand-icons";

import { Copy } from "@/components/content";
import { ProjectFrame } from "@/components/project-frame";
import { Reveal } from "@/components/reveal";
import { Container, Section, SectionHeading } from "@/components/section";
import { TechList } from "@/components/tech-list";
import { plain, projects, type Project } from "@/content/portfolio";
import { cn } from "@/lib/utils";

export function SelectedWork() {
  return (
    <Section id="work" className="relative">
      <Container>
        <SectionHeading
          id="work"
          eyebrow="Selected work"
          title="Five projects, in detail"
          intro="Five pieces of frontend work — catalogs, marketing sites, motion, memberships and an AI-powered interface. Each one is live; open a project for a closer look."
        />

        <div className="mt-14 flex flex-col gap-20 sm:mt-16 sm:gap-24">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={index}
              priority={index === 0}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

function ProjectRow({
  project,
  index,
  priority,
}: {
  project: Project;
  index: number;
  priority: boolean;
}) {
  const flipped = index % 2 === 1;
  const headingId = `project-${project.slug}-title`;

  return (
    <Reveal as="article" aria-labelledby={headingId}>
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
        <div
          className={cn(
            "lg:col-span-7",
            flipped ? "lg:order-2" : "lg:order-1",
          )}
        >
          <Link
            href={`/work/${project.slug}`}
            tabIndex={-1}
            aria-hidden
            className="block"
          >
            <ProjectFrame
              project={project}
              priority={priority}
              sizes="(min-width: 1024px) 58vw, 92vw"
            />
          </Link>
        </div>

        <div
          className={cn(
            "lg:col-span-5",
            flipped ? "lg:order-1" : "lg:order-2",
          )}
        >
          <p className="text-bronze font-mono text-xs tracking-[0.2em]">
            {String(index + 1).padStart(2, "0")}
          </p>

          <h3
            id={headingId}
            className="text-charcoal mt-3 font-serif text-3xl leading-tight font-normal text-balance sm:text-[2.125rem]"
          >
            <Link
              href={`/work/${project.slug}`}
              className="link-quiet focus-visible:outline-bronze"
            >
              <Copy value={project.name} />
            </Link>
          </h3>

          <p className="text-graphite mt-4 leading-relaxed">
            <Copy value={project.description} />
          </p>

          {project.role || project.technologies.length > 0 ? (
            <dl className="mt-7 space-y-5 text-sm">
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
                  <dt className="eyebrow">Built with</dt>
                  <dd className="mt-2.5">
                    <TechList items={project.technologies} />
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <div className="border-stone-line/80 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-6">
            <ProjectLiveLink project={project} prominent />
            <Link
              href={`/work/${project.slug}`}
              className="text-graphite hover:text-bronze group inline-flex items-center gap-1.5 text-sm transition-colors duration-300"
            >
              Project details
              <ArrowUpRight
                aria-hidden
                className="ease-stone size-3.5 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            {project.links.source ? (
              <ProjectSourceLink project={project} />
            ) : null}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function ProjectLiveLink({
  project,
  prominent = false,
  className,
}: {
  project: Project;
  prominent?: boolean;
  className?: string;
}) {
  if (!project.links.live) return null;
  const label = plain(project.name);

  return (
    <a
      href={project.links.live}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group inline-flex items-center gap-2 transition-colors duration-300",
        prominent
          ? "bg-charcoal text-alabaster hover:bg-charcoal/88 h-11 rounded-sm px-5 text-sm font-normal tracking-wide"
          : "text-graphite hover:text-bronze text-sm",
        className,
      )}
    >
      <Globe aria-hidden className="size-3.5" />
      View Live Project
      <span className="sr-only"> for {label} (opens in a new tab)</span>
      <ArrowUpRight
        aria-hidden
        className="ease-stone size-3.5 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}

export function ProjectSourceLink({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  if (!project.links.source) return null;
  const label = plain(project.name);

  return (
    <a
      href={project.links.source}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "text-graphite hover:text-bronze inline-flex items-center gap-1.5 text-sm transition-colors duration-300",
        className,
      )}
    >
      <GithubIcon aria-hidden className="size-3.5" />
      Source
      <span className="sr-only">for {label} (opens in a new tab)</span>
    </a>
  );
}

export function ProjectExternalLinks({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const hasAny = project.links.live || project.links.source;
  if (!hasAny) return null;

  return (
    <>
      <ProjectLiveLink project={project} className={className} />
      <ProjectSourceLink project={project} className={className} />
    </>
  );
}
