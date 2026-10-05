import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function Section({
  id,
  className,
  children,
  label,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
  /** Names the landmark for screen readers when there is no visible heading. */
  label?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      aria-labelledby={label ? undefined : `${id}-title`}
      className={cn("scroll-mt-24 py-20 sm:py-24 lg:py-28", className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = "start",
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <span aria-hidden className="bg-bronze-soft/70 h-px w-8" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2
        id={`${id}-title`}
        className="display-xl text-charcoal text-4xl text-balance sm:text-5xl lg:text-[3.5rem]"
      >
        {title}
      </h2>
      {intro ? (
        <div
          className={cn(
            "text-graphite measure text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {intro}
        </div>
      ) : null}
    </Reveal>
  );
}

/**
 * A quiet marble interlude between sections. Purely decorative, so it is hidden
 * from assistive technology and never carries meaning.
 */
export function SectionRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-5", className)}>
      <span className="via-stone-line/90 h-px flex-1 bg-gradient-to-r from-transparent to-70% to-transparent" />
      <span className="bg-bronze-soft/60 size-1.5 rotate-45" />
      <span className="via-stone-line/90 h-px flex-1 bg-gradient-to-l from-transparent to-70% to-transparent" />
    </div>
  );
}
