import { isPlaceholder, plain } from "@/content/portfolio";
import { cn } from "@/lib/utils";

/**
 * Renders a string from the content file. Finished copy renders as plain text;
 * unfinished copy keeps the same words but is marked — visually and for screen
 * readers — so it can never be mistaken for the real thing.
 */
export function Copy({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  if (!isPlaceholder(value)) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span data-placeholder="" className={cn("placeholder-mark", className)}>
      <span className="sr-only">Placeholder content: </span>
      {plain(value)}
    </span>
  );
}

/**
 * Shown while any bracketed value is still in the content file, so the site is
 * never mistaken for finished. It disappears on its own once the last
 * placeholder is replaced.
 */
export function DraftNotice() {
  return (
    <aside
      aria-label="Draft content notice"
      className="border-bronze-soft/35 bg-accent/60 border-b"
    >
      <p className="text-graphite mx-auto max-w-6xl px-6 py-2.5 text-center text-xs leading-relaxed sm:px-8">
        <span className="text-bronze font-medium">Draft content.</span>{" "}
        Underlined passages are placeholders. Replace them in{" "}
        <code className="font-mono text-[0.95em]">src/content/portfolio.ts</code>{" "}
        and this notice disappears.
      </p>
    </aside>
  );
}
