"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

type SculptureProps = {
  src: StaticImageData;
  /** Decorative by default; pass a description only if it carries meaning. */
  alt?: string;
  className?: string;
  imageClassName?: string;
  /** Pixels of vertical drift across the full scroll pass. 0 disables it. */
  drift?: number;
  sizes: string;
  priority?: boolean;
  /**
   * `subject` places the stone as a piece in its own right, dissolving its
   * edges into the page. `band` crops it to fill the wrapper as a section
   * transition, fading out top and bottom.
   */
  variant?: "subject" | "band";
};

/**
 * A marble image placed as decoration. It drifts slightly against the scroll to
 * give the stone some depth, holds its aspect ratio from the static import so
 * it cannot shift layout, and shows a blurred stone-coloured placeholder while
 * the bytes arrive.
 */
export function Sculpture({
  src,
  alt = "",
  className,
  imageClassName,
  drift = 48,
  sizes,
  priority = false,
  variant = "subject",
}: SculptureProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion || drift === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewport) return;

      // -1 when the element sits below the fold, 1 once it has scrolled past.
      const progress =
        ((viewport - rect.top) / (viewport + rect.height)) * 2 - 1;
      node.style.setProperty("--drift", `${(-progress * drift).toFixed(2)}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      node.style.removeProperty("--drift");
    };
  }, [drift, reducedMotion]);

  const band = variant === "band";

  const image = (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      // Bands sit behind content on a negative layer, where Chromium's lazy
      // heuristics never decide they are near the viewport. They are a few
      // kilobytes each and carry the section transitions, so load them outright
      // rather than preloading them ahead of the hero.
      loading={band && !priority ? "eager" : undefined}
      placeholder="blur"
      quality={85}
      className={cn(
        "mix-blend-multiply select-none",
        band ? "size-full object-cover" : "h-auto w-full",
        imageClassName,
      )}
      draggable={false}
    />
  );

  if (band) {
    // The fade has to live on the clipping box. On the inner element it would
    // be cropped away by `overflow-hidden`, leaving the hard edge it exists to
    // avoid. The inner element bleeds past the box to give the drift headroom,
    // so no edge of the stone can scroll into view.
    return (
      <div
        aria-hidden={alt === "" ? true : undefined}
        className={cn("stone-band absolute inset-0 overflow-hidden", className)}
      >
        <div
          ref={ref}
          className="absolute inset-x-0 -inset-y-24 will-change-transform"
          style={{ translate: "0 var(--drift, 0px)" }}
        >
          {image}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden={alt === "" ? true : undefined}
      className={cn("stone-emerge will-change-transform", className)}
      style={{ translate: "0 var(--drift, 0px)" }}
    >
      {image}
    </div>
  );
}
