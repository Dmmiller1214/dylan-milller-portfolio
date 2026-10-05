import { Copy } from "@/components/content";
import { cn } from "@/lib/utils";

/** Technology chips. Styled as engraved stone rather than coloured pills. */
export function TechList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="border-stone-line bg-alabaster text-graphite rounded-sm border px-2.5 py-1 font-mono text-xs tracking-wide"
        >
          <Copy value={item} className="no-underline" />
        </li>
      ))}
    </ul>
  );
}
