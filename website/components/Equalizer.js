"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

const heights = [30, 55, 40, 80, 62, 95, 48, 70, 35, 88, 58, 74, 42, 66, 28, 84, 52, 76, 38, 60, 92, 46, 68, 33];

export default function Equalizer() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = anime({
      targets: ref.current.children,
      scaleY: [0.25, 1],
      duration: 900,
      delay: anime.stagger(70),
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
    return () => anim.pause();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="flex h-16 items-end gap-1.5">
      {heights.map((h, i) => (
        <span
          key={i}
          style={{ height: `${h}%`, transformOrigin: "bottom" }}
          className="w-1.5 rounded-full bg-gradient-to-t from-fern to-fern-soft sm:w-2"
        />
      ))}
    </div>
  );
}
