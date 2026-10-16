"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenisScroll(
  onScroll?: (e: { scroll: number; velocity: number; progress: number }) => void
) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    if (onScroll) {
      lenis.on("scroll", onScroll);
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
