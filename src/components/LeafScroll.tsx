import React, { useEffect, useRef, useState } from "react";
import "./leaf-scroll.css";

// tuning: every leaf's position is a function of the (smoothed) scroll progress p (0..1)
const LEAF_COUNT = 10; // leaves in the flurry (phones show the first MOBILE_COUNT)
const MOBILE_COUNT = 6;
const FALLS = 2; // times each leaf crosses the screen over a full page scroll (scaled per leaf)
const START_VH = -15; // leaves enter just above the screen...
const END_VH = 115; // ...and leave just below it, then wrap back to the top off-screen
const SWAY_VW = [4, 12]; // side-to-side sway range, in vw
const WIND_VW = [8, 28]; // sideways travel across one fall, in vw
const ROCK_DEG = [18, 38]; // rocking angle range
const FLUTTER_DEG = 6; // small fast flutter on top of the rock
const SIZE = [0.55, 1.15]; // size range, relative to the css leaf size
const OPACITY = [0.55, 1]; // fainter leaves read as further away
const STATIC_P = 0.3; // where the flurry rests when reduced motion is on
const SMOOTHING = 0.06; // how fast the shown progress catches up (per 60fps frame; lower = silkier)

// momentum: after you stop scrolling the flurry keeps drifting the same way, then settles
const IMPULSE = 0.03; // how much of each scroll step turns into momentum
const FRICTION = 0.95; // per-frame decay of the momentum (closer to 1 = longer glide)
const ABSORB = 8; // while scrolling, drift is quietly folded back so it never runs away
const MAX_DRIFT = 0.12; // furthest the flurry can get ahead of / behind the scroll (fraction of page)

// seeded random so the flurry looks the same on every visit
const rand = (() => {
  let s = 20261103;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();
const between = ([a, b]: number[]) => a + (b - a) * rand();

// each leaf gets its own lane, speed, sway, spin and wind direction
const LEAVES = Array.from({ length: LEAF_COUNT }, (_, i) => {
  const size = between(SIZE);
  return {
    x0: 8 + (84 * (i + rand() * 0.8)) / LEAF_COUNT, // spread lanes across the width
    offset: rand(), // where in its fall the leaf starts
    speed: 0.7 + size * 0.5 + rand() * 0.2, // bigger (closer) leaves fall a bit faster
    sway: between(SWAY_VW),
    sways: 1 + rand() * 1.5,
    wind: between(WIND_VW) * (rand() < 0.75 ? 1 : -1), // most drift the same way, like a breeze
    rock: between(ROCK_DEG),
    phase: rand() * Math.PI * 2,
    size,
    opacity: between(OPACITY),
  };
});

const LeafScroll = () => {
  const leafRefs = useRef<(SVGSVGElement | null)[]>([]);
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("leaf-page");

    let vw = 0;
    let vh = 0;
    let maxScroll = 1;

    const measure = () => {
      vw = window.innerWidth / 100;
      vh = window.innerHeight / 100;
      maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
    };

    const apply = (p: number) => {
      LEAVES.forEach((l, i) => {
        const el = leafRefs.current[i];
        if (!el) return;
        const fall = l.offset + p * FALLS * l.speed;
        const u = fall - Math.floor(fall); // 0..1 through the current fall, wraps off-screen
        const a = 2 * Math.PI * l.sways * u + l.phase;
        const x = (l.x0 + l.wind * (u - 0.5) + l.sway * Math.sin(a)) * vw;
        const y = (START_VH + (END_VH - START_VH) * u) * vh;
        const r = l.rock * Math.cos(a) + FLUTTER_DEG * Math.sin(3 * a);
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${r}deg) scale(${l.size})`;
      });
    };

    const onResizeBg = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResizeBg);

    // reduced motion: place the flurry once and skip the loop
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const place = () => {
        measure();
        apply(STATIC_P);
      };
      place();
      window.addEventListener("resize", place);
      return () => {
        window.removeEventListener("resize", place);
        window.removeEventListener("resize", onResizeBg);
        root.classList.remove("leaf-page");
      };
    }

    let target = 0;
    let shown = 0;
    let raf = 0;
    let lastTarget = 0;
    let velocity = 0;
    let drift = 0;
    let lastTime = 0;

    const readTarget = () => {
      target = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    // eases shown toward target + drift; no layout reads in here
    const tick = (now: number) => {
      // frames = how many 60fps frames passed, so speed is the same on 60/120/144Hz screens
      const frames = lastTime ? Math.min(4, (now - lastTime) / (1000 / 60)) : 1;
      lastTime = now;

      const dp = target - lastTarget;
      lastTarget = target;
      if (dp !== 0) drift -= drift * Math.min(1, Math.abs(dp) * ABSORB);
      velocity += dp * IMPULSE;
      velocity *= Math.pow(FRICTION, frames);
      drift = Math.min(MAX_DRIFT, Math.max(-MAX_DRIFT, drift + velocity * frames));

      const goal = Math.min(1, Math.max(0, target + drift));
      shown += (goal - shown) * (1 - Math.pow(1 - SMOOTHING, frames));
      apply(shown);

      if (Math.abs(goal - shown) < 0.0001 && Math.abs(velocity) < 0.000001) {
        raf = 0;
        lastTime = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      readTarget();
      start();
    };

    // page height changes as images load, and sizes change on resize
    const onResize = () => {
      measure();
      readTarget();
      apply(shown);
      start();
    };

    measure();
    readTarget();
    shown = target; // no glide on first load
    lastTarget = target;
    apply(shown);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", onResizeBg);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove("leaf-page");
    };
  }, []);

  const { w, h } = vp;
  // contour lines across the upper right
  const contours = [0.1, 0.17, 0.24].map((t) => {
    const y = h * t;
    return `M ${w * 0.4} ${y} C ${w * 0.55} ${y - h * 0.08}, ${w * 0.68} ${y + h * 0.1}, ${w * 0.82} ${y + h * 0.02} S ${w * 0.97} ${y - h * 0.07}, ${w * 1.05} ${y + h * 0.03}`;
  });

  return (
    <>
      {/* static hairline background: circles centred off-canvas lower right */}
      <svg className="leaf-bg" aria-hidden="true" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0.35, 0.6, 0.9, 1.2].map((r) => (
          <circle key={r} cx={w * 1.08} cy={h * 1.1} r={h * r} />
        ))}
        {contours.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>

      {LEAVES.map((l, i) => (
        <svg
          key={i}
          ref={(el) => (leafRefs.current[i] = el)}
          className={`leaf${i >= MOBILE_COUNT ? " leaf-extra" : ""}`}
          style={{ opacity: l.opacity }}
          aria-hidden="true"
          viewBox="0 0 60 180"
        >
          <path d="M30 0 C70 45 70 135 30 180 C-10 135 -10 45 30 0 Z" />
        </svg>
      ))}
    </>
  );
};

export default LeafScroll;
