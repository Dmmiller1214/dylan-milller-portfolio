"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query. The server snapshot is supplied separately so
 * hydration matches the markup React produced on the server, after which the
 * real value takes over without a mismatch warning.
 */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}

/**
 * True when the user has asked for reduced motion. Assumed true on the server
 * so nothing animates before the preference is known.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolledPast(threshold: number): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true });
    return () => window.removeEventListener("scroll", onChange);
  }, []);

  const getSnapshot = useCallback(
    () => window.scrollY > threshold,
    [threshold],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
