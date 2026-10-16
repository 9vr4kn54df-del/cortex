"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";
import { TextReveal } from "@/components/animation/TextReveal";
import { GSAPScrollSection } from "@/components/animation/GSAPScrollSection";
import { GlowCard } from "@/components/ui/GlowCard";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // hero tagline fade-in on load
      gsap.from(taglineRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });

      // hero parallax on scroll
      gsap.to(heroRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-zinc-950 text-white min-h-screen">

      {/* ── HERO — GSAP parallax + framer-motion text reveal ── */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden px-8">
        <div ref={heroRef} className="flex flex-col items-center gap-6 text-center">
          <span
            ref={taglineRef}
            className="text-xs tracking-[0.3em] uppercase text-white/40"
          >
            gsap · lenis · react-bits · 21st.dev
          </span>

          {/* react-bits TextReveal component */}
          <TextReveal
            text="build shit that moves"
            className="text-5xl md:text-8xl font-bold tracking-tight leading-none"
            delay={0.1}
          />

          <TextReveal
            text="smooth scroll, scroll-triggered animations, animated components — all wired."
            className="max-w-xl text-base md:text-lg text-white/50 leading-relaxed"
            delay={0.4}
          />
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/20 text-xs tracking-widest uppercase">
          <div className="w-px h-12 bg-white/20 animate-pulse" />
          scroll
        </div>
      </section>

      {/* ── GSAP SCROLL SECTION ── */}
      <GSAPScrollSection />

      {/* ── 21st.dev GLOW CARDS SECTION ── */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-20 py-32 gap-12">
        <TextReveal
          text="21st.dev glow cards"
          className="text-4xl md:text-6xl font-bold"
        />
        <p className="text-white/40 text-sm max-w-md -mt-6">
          mouse-tracked radial glow — 21st.dev style, zero deps beyond Tailwind
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          {[
            { title: "Scroll", body: "Lenis handles inertia and momentum. runs in RAF, destroys on unmount." },
            { title: "Animate", body: "GSAP timelines and ScrollTrigger. context-scoped, auto-cleaned." },
            { title: "Compose", body: "Drop react-bits components in. framer-motion already installed." },
          ].map((card) => (
            <GlowCard key={card.title}>
              <p className="font-semibold text-white mb-2">{card.title}</p>
              <p className="text-sm text-white/50">{card.body}</p>
            </GlowCard>
          ))}
        </div>
      </section>

    </main>
  );
}
