"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Equalizer from "./Equalizer";
import { RELEASES, REPO } from "./config";

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-word", { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12 })
        .from(".hero-fade", { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, "-=0.5");
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-32 pb-20 text-center">
      <h1 className="font-display text-[2.6rem] leading-[1.1] font-semibold tracking-tight sm:text-[3.4rem] md:text-[4.2rem]">
        <span className="block overflow-hidden">
          <span className="hero-word inline-block">Your music.</span>
        </span>
        <span className="block overflow-hidden pb-2">
          <span className="hero-word inline-block font-serif text-[1.08em] font-normal italic">
            <span className="shimmer-text">Every screen.</span>
          </span>
        </span>
      </h1>

      <p className="hero-fade mt-6 max-w-xl text-base leading-relaxed text-body md:text-lg">
        A free, ad-free music player for Android and Windows. YouTube Music, JioSaavn, your own
        files, synced lyrics and a 10-band equalizer, in one quiet app.
      </p>

      <div className="hero-fade mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={RELEASES}
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-black shadow-soft transition hover:bg-white/80"
        >
          Download for Android
        </a>
        <a
          href={RELEASES}
          className="rounded-full border border-line bg-white/[0.04] px-6 py-3 text-sm font-medium text-ink transition hover:bg-white/10"
        >
          Download for Windows
        </a>
        <a href={REPO} className="px-4 py-3 text-sm text-body transition hover:text-ink">
          View source
        </a>
      </div>

      <div className="hero-fade mt-16">
        <Equalizer />
      </div>
    </section>
  );
}
