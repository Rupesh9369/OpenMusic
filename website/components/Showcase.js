"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

const windowScreens = [
  { label: "Home", src: "/shots/01-home.png" },
  { label: "Discover", src: "/shots/02-discover.png" },
  { label: "Search", src: "/shots/03-search.png" },
  { label: "Library", src: "/shots/04-library.png" },
  { label: "Settings", src: "/shots/05-settings.png" },
];

export default function Showcase() {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(".showcase-win", {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to(".showcase-phone", {
        y: 50,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="screens" ref={root} className="px-5 py-24 md:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm text-fern-soft">The real app</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-[2.5rem]">
          Screenshots from the actual code.
        </h2>
        <p className="mt-4 text-body">Same screens you get from the APK and the Windows installer.</p>
      </Reveal>

      <div className="mx-auto mt-16 grid max-w-[1100px] items-center gap-12 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
        {/* Android phone */}
        <Reveal className="mx-auto w-full max-w-[300px]">
          <div className="showcase-phone">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[36px] border border-line bg-card p-2.5 shadow-soft"
          >
            <img
              src="/shots/android-screenshot.png"
              alt="OpenMusic on Android: home screen"
              className="w-full rounded-[28px]"
            />
          </motion.div>
          <p className="mt-5 text-center text-sm text-body">Android · home</p>
          </div>
        </Reveal>

        {/* Windows window with tabs */}
        <Reveal delay={0.1} className="w-full">
          <div className="showcase-win">
          <div className="overflow-hidden rounded-[20px] border border-line bg-card shadow-soft">
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
              <span className="mr-2 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="h-2.5 w-2.5 rounded-full bg-line" />
              </span>
              {windowScreens.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setActive(i)}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    active === i ? "bg-ink text-black" : "text-body hover:text-ink"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="relative aspect-[16/10] bg-black">
              <AnimatePresence mode="wait">
                <motion.img
                  key={windowScreens[active].src}
                  src={windowScreens[active].src}
                  alt={`OpenMusic on Windows: ${windowScreens[active].label}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </AnimatePresence>
            </div>
          </div>
          <p className="mt-5 text-center text-sm text-body">Windows · {windowScreens[active].label}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
