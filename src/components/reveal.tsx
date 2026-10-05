"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/**
 * A single scroll pass shared by every Reveal on the page.
 *
 * This deliberately does not use IntersectionObserver. An observer only fires
 * when the intersection ratio crosses a threshold, so an element carried from
 * below the fold to above it in one jump — an anchor link, a flick of the
 * trackpad, a restored scroll position — goes from ratio 0 to ratio 0 without
 * ever reporting, and would stay invisible for good. Measuring the pending
 * elements against the trigger line cannot miss that case.
 *
 * Rects are read for every pending element first and the reveals written
 * afterwards, so a pass never interleaves layout reads with style writes. The
 * registry only ever holds elements that are still hidden, and it drains as the
 * reader moves down the page.
 */
const pending = new Set<HTMLElement>();
let frame = 0;
let listening = false;

/** Fraction of the viewport an element must reach before it is revealed. */
const TRIGGER = 0.88;

function sweep() {
  frame = 0;
  if (pending.size === 0) return;

  const line = window.innerHeight * TRIGGER;
  const due: HTMLElement[] = [];

  for (const node of pending) {
    if (node.getBoundingClientRect().top < line) due.push(node);
  }

  for (const node of due) {
    node.dataset.state = "shown";
    pending.delete(node);
  }

  if (pending.size === 0) stopListening();
}

function schedule() {
  if (frame) return;
  frame = window.requestAnimationFrame(sweep);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

function register(node: HTMLElement) {
  pending.add(node);
  startListening();
  schedule();
}

function unregister(node: HTMLElement) {
  pending.delete(node);
  if (pending.size === 0) stopListening();
}

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  /** Staggers siblings. Capped so long lists never feel slow. */
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "footer";
};

/**
 * Fades and lifts content the first time it scrolls into view.
 *
 * The hidden state is written straight to the DOM rather than held in React
 * state: the server markup is therefore fully visible — nothing disappears if
 * JavaScript fails — and revealing an element costs no re-render. When the user
 * prefers reduced motion the hidden state is never applied at all.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reducedMotion) {
      delete node.dataset.state;
      return;
    }

    // Leave anything already on screen alone, so hydration can't make visible
    // content flash out and back in.
    if (node.getBoundingClientRect().top < window.innerHeight * TRIGGER) return;

    node.dataset.state = "hidden";
    register(node);

    return () => {
      unregister(node);
      delete node.dataset.state;
    };
  }, [reducedMotion]);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={
        delay ? { transitionDelay: `${Math.min(delay, 320)}ms`, ...style } : style
      }
      className={cn(
        "ease-stone transition-[opacity,transform] duration-[900ms]",
        "data-[state=hidden]:translate-y-5 data-[state=hidden]:opacity-0",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
