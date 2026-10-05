import Image from "next/image";

import { plain, type Project } from "@/content/portfolio";
import { cn } from "@/lib/utils";

/**
 * Holds a project screenshot inside a fixed 16:10 frame so the row never
 * reflows while the image decodes.
 *
 * Without a screenshot it draws an empty gallery mount at the same ratio —
 * labelled, and plainly waiting for the real thing rather than papered over
 * with stock imagery.
 */
export function ProjectFrame({
  project,
  priority = false,
  sizes,
  className,
}: {
  project: Project;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const { screenshot, name } = project;
  const label = plain(name);

  if (!screenshot) {
    return (
      <div
        role="img"
        aria-label={`Screenshot not yet provided for ${label}`}
        className={cn(
          "border-stone-line relative aspect-16/10 overflow-hidden border",
          "bg-[linear-gradient(145deg,var(--alabaster)_0%,var(--muted)_58%,var(--alabaster)_100%)]",
          className,
        )}
      >
        <span
          aria-hidden
          className="border-stone-line/70 absolute inset-4 border border-dashed sm:inset-6"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
          <span aria-hidden className="bg-bronze-soft/50 size-1.5 rotate-45" />
          <p className="text-graphite max-w-[26ch] text-xs leading-relaxed">
            Awaiting a screenshot. Add the image to{" "}
            <code className="font-mono">public/</code> and set{" "}
            <code className="font-mono">screenshot</code> for this project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group/frame border-stone-line bg-alabaster relative aspect-16/10 overflow-hidden border",
        className,
      )}
    >
      <Image
        src={screenshot.src}
        alt={screenshot.alt}
        width={screenshot.width}
        height={screenshot.height}
        sizes={sizes}
        priority={priority}
        quality={82}
        className="ease-stone size-full object-cover object-top transition-transform duration-700 group-hover/frame:scale-[1.02]"
      />
      <span
        aria-hidden
        className="ring-bronze-soft/0 group-hover/frame:ring-bronze-soft/35 pointer-events-none absolute inset-0 ring-1 ring-inset transition-[--tw-ring-color] duration-500"
      />
    </div>
  );
}
