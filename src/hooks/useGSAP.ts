"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function useGSAPTimeline(
  callback: (tl: gsap.core.Timeline) => void,
  deps: React.DependencyList = []
) {
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    tl.current = gsap.timeline();
    callback(tl.current);

    return () => {
      tl.current?.kill();
    };
  }, deps);

  return tl;
}
