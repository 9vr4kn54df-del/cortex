"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

export function GSAPScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // headline scrubs as you scroll
      gsap.fromTo(
        headlineRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );

      // stagger cards in
      gsap.fromTo(
        cardsRef.current?.children ?? [],
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const items = [
    { label: "GSAP", desc: "scroll-triggered animations, timelines, scrubs" },
    { label: "Lenis", desc: "buttery smooth momentum scrolling" },
    { label: "react-bits", desc: "copy-paste animated components" },
    { label: "21st.dev", desc: "shadcn-style UI component registry" },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center px-8 md:px-20 py-32 gap-16"
    >
      <h2
        ref={headlineRef}
        className="text-5xl md:text-7xl font-bold text-white tracking-tight opacity-0"
      >
        the stack
      </h2>

      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 opacity-0"
          >
            <p className="text-lg font-semibold text-white mb-1">{item.label}</p>
            <p className="text-sm text-white/50">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
