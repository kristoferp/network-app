"use client";
import React, { useState, useEffect, useRef, CSSProperties } from "react";

// ── Navigation sections ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: "intro",      label: "Intro" },
  { id: "timeline",   label: "Timeline" },
  { id: "works-well", label: "What works well" },
  { id: "impression", label: "First impression" },
  { id: "solution",   label: "Solution" },
];

// ── Figma canvas helpers (1920 × 1080) ──────────────────────────────────────
// Font / spacing: px → vw  (at 1920px viewport = exact Figma px)
const fs = (px: number) => `${px / 19.2}vw`;
// Width percentage of the 1920-wide canvas
const wp = (px: number) => `${(px / 1920) * 100}%`;
// Height percentage of the 1080-tall canvas
const hp = (px: number) => `${(px / 1080) * 100}%`;
// Absolute position on the 1920 × 1080 canvas → CSS
const abs = (l: number, t: number, extra?: CSSProperties): CSSProperties => ({
  position: "absolute",
  left: `${(l / 1920) * 100}%`,
  top: `${(t / 1080) * 100}%`,
  ...extra,
});

// ── Shared visibility hook ───────────────────────────────────────────────────
function useVisible(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, v] as const;
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function CaseStudy() {
  const [active, setActive] = useState("intro");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.3 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const reg = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };
  const scrollTo = (id: string) =>
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Google Sans', sans-serif", background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin-arc {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Side nav ── */}
      <nav style={{
        position: "fixed", right: 28, top: "50%", transform: "translateY(-50%)",
        zIndex: 100, display: "flex", flexDirection: "column", gap: 12,
      }}>
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => scrollTo(s.id)} title={s.label}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}>
            <span style={{ fontSize: 11, color: "#9da1a7", opacity: active === s.id ? 1 : 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>{s.label}</span>
            <span style={{
              display: "block", borderRadius: "50%",
              width: active === s.id ? 8 : 6, height: active === s.id ? 8 : 6,
              background: active === s.id ? "#0073f1" : "#d1d5db",
              transition: "all 0.25s",
            }} />
          </button>
        ))}
      </nav>

      {/* ══ SLIDE 1 — HERO ══════════════════════════════════════════════════ */}
      <section id="intro" ref={(el) => reg("intro")(el as HTMLElement | null)}>
        <SlideCanvas><Slide1 /></SlideCanvas>
      </section>

      {/* ══ SLIDE 2 — TIMELINE ══════════════════════════════════════════════ */}
      <section id="timeline" ref={(el) => reg("timeline")(el as HTMLElement | null)}>
        <SlideCanvas><Slide2 /></SlideCanvas>
      </section>

      {/* ══ SLIDE 5 — WHAT WORKS WELL ═══════════════════════════════════════ */}
      <section id="works-well" ref={(el) => reg("works-well")(el as HTMLElement | null)}>
        <SlideCanvas><Slide5 /></SlideCanvas>
      </section>

      {/* ══ SLIDE 3 — FIRST IMPRESSION ══════════════════════════════════════ */}
      <section id="impression" ref={(el) => reg("impression")(el as HTMLElement | null)}>
        <SlideCanvas><Slide3 /></SlideCanvas>
      </section>

      {/* ══ SOLUTION — LIVE APP ════════════════════════════════════════════= */}
      <section id="solution" ref={(el) => reg("solution")(el as HTMLElement | null)}>
        <SlideCanvas><SolutionSlide /></SlideCanvas>
      </section>

      <footer style={{ padding: "32px 0", textAlign: "center", borderTop: "1px solid #f0f0f0" }}>
        <p style={{ fontSize: 12, color: "#c0c4cb" }}>Kristofer Pallfy · UX Design Case Study · 2025</p>
      </footer>
    </div>
  );
}

// 16 : 9 aspect-ratio container — children position with abs()
function SlideCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}

// ── SLIDE 1 — HERO ──────────────────────────────────────────────────────────
// Figma node 1:5  "Slide 16:9 - 1"
function Slide1() {
  const [ref, v] = useVisible();
  const f = (d: number): CSSProperties => ({
    opacity: v ? 1 : 0,
    transition: `opacity 0.65s ease ${d}s`,
  });
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, background: "#fff" }}>
      {/* Headline */}
      <p style={{
        ...abs(86, 200), ...f(0),
        fontSize: fs(90), fontWeight: 400, color: "#000",
        lineHeight: 1.1, width: wp(956),
      }}>
        What does a home user see when they open the app?
      </p>
      {/* "UniFi Dream 7 router" bold */}
      <p style={{ ...abs(83, 667), ...f(0.2), fontSize: fs(44), fontWeight: 700, color: "#000", width: wp(923) }}>
        UniFi Dream 7 router
      </p>
      {/* Blue separator */}
      <div style={{ ...abs(86, 743), ...f(0.28), width: wp(1079), height: "1px", background: "#0073f1" }} />
      {/* Byline */}
      <p style={{ ...abs(86, 763), ...f(0.32), fontSize: fs(32), fontWeight: 400, color: "#000" }}>
        Kristofer Pallfy - UX-review
      </p>
      {/* Router photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/router.png" alt="UniFi Dream Router 7"
        style={{ ...abs(1224, 155), ...f(0.1), width: wp(459), objectFit: "contain" }} />
    </div>
  );
}

// ── SLIDE 2 — TIMELINE ──────────────────────────────────────────────────────
// Figma node 2:2  "Slide 16:9 - 2"
function Slide2() {
  const [ref, v] = useVisible();
  const f = (d: number): CSSProperties => ({
    opacity: v ? 1 : 0,
    transition: `opacity 0.5s ease ${d}s`,
  });
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, background: "#fff" }}>
      {/* Title */}
      <p style={{ ...abs(86, 200), ...f(0), fontSize: fs(90), fontWeight: 400, color: "#000" }}>
        Getting started - timeline
      </p>
      {/* Subtitle */}
      <p style={{ ...abs(86, 337), ...f(0.05), fontSize: fs(32), color: "#000" }}>
        UniFi Dream 7 router + UniFi App
      </p>

      {/* Gray base line — animates left → right */}
      <div style={{ ...abs(86, 517), width: wp(1632), height: "1px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "#d1d5db", width: v ? "100%" : "0%", transition: "width 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s" }} />
      </div>
      {/* Red segment — animates left → right */}
      <div style={{ ...abs(387, 514), height: "3px", overflow: "hidden", width: wp(745) }}>
        <div style={{ height: "100%", background: "#ef4444", width: v ? "100%" : "0%", transition: "width 0.8s cubic-bezier(0.4,0,0.2,1) 0.8s" }} />
      </div>

      {/* Time labels */}
      {([
        { x: 86,   label: "07:57",             italic: false, red: false },
        { x: 336,  label: "08:00",             italic: false, red: false },
        { x: 618,  label: "1 hour 22 minutes", italic: true,  red: true  },
        { x: 1081, label: "09:22",             italic: false, red: false },
        { x: 1308, label: "09:23",             italic: false, red: false },
        { x: 1522, label: "09:24",             italic: false, red: false },
      ] as const).map((t, i) => (
        <p key={i} style={{
          ...abs(t.x, 449), ...f(0.15 + i * 0.07),
          fontSize: fs(32), fontStyle: t.italic ? "italic" : "normal",
          color: t.red ? "#ef4444" : "#000", whiteSpace: "nowrap",
        }}>{t.label}</p>
      ))}

      {/* Celebrate emoji */}
      <p style={{ ...abs(1745, 490), ...f(0.6), fontSize: fs(34) }}>🎉</p>

      {/* Event labels below line */}
      <p style={{ ...abs(86,   545), ...f(0.20), fontSize: fs(24), color: "#000" }}>App opened</p>
      <p style={{ ...abs(336,  545), ...f(0.25), fontSize: fs(24), color: "#000" }}>0 devices found</p>
      <p style={{ ...abs(1081, 545), ...f(0.40), fontSize: fs(24), color: "#000" }}>Factory reset</p>
      <p style={{ ...abs(1308, 545), ...f(0.45), fontSize: fs(24), color: "#000" }}>Connected</p>
      <p style={{ ...abs(1522, 545), ...f(0.50), fontSize: fs(24), color: "#000" }}>Setup Complete!</p>

      {/* Troubleshooting text */}
      <div style={{ ...abs(589, 563), width: wp(443), ...f(0.3) }}>
        <p style={{ fontSize: fs(24), color: "#000", lineHeight: 1.5 }}>
          Troubleshooting, testing different ports etc. Called ISP (bridged a port).
        </p>
        <p style={{ fontSize: fs(24), color: "#ef4444", fontWeight: 500, marginTop: "0.3em" }}>
          App guidance did not help
        </p>
      </div>

      {/* Dashed red box */}
      <div style={{
        ...abs(577, 543),
        width: wp(454), height: hp(128),
        border: "1px dashed #ef4444", borderRadius: 4,
        pointerEvents: "none",
        opacity: v ? 1 : 0, transition: "opacity 0.5s ease 0.3s",
      }} />

      {/* Note text */}
      <p style={{ ...abs(967, 889), width: wp(443), ...f(0.7), fontSize: fs(24), color: "#000", lineHeight: 1.55 }}>
        There is a help section in the app but nothing about resetting to factory settings.
      </p>

      {/* Phone screenshot */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/device-setup-help.png" alt="Device Setup Help"
        style={{ ...abs(1395, 673), width: wp(355), borderRadius: fs(50), boxShadow: "0 4px 24px rgba(0,0,0,0.15)", ...f(0.65) }} />

      {/* Diagonal line: dashed-box bottom-right → phone image */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
        <line
          x1={`${(1031 / 1920) * 100}%`} y1={`${(671 / 1080) * 100}%`}
          x2={`${(1365 / 1920) * 100}%`} y2={`${(886 / 1080) * 100}%`}
          stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4"
          strokeOpacity={v ? 0.5 : 0}
          style={{ transition: "stroke-opacity 0.5s ease 0.9s" }}
        />
      </svg>
    </div>
  );
}

// ── SLIDE 5 — WHAT WORKS WELL ────────────────────────────────────────────────
// Figma node 65:55  "Slide 16:9 - 5"
function Slide5() {
  const [ref, v] = useVisible();
  const f = (d: number): CSSProperties => ({
    opacity: v ? 1 : 0,
    transition: `opacity 0.6s ease ${d}s`,
  });
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, background: "#fff" }}>
      {/* Title */}
      <p style={{ ...abs(86, 220), ...f(0), fontSize: fs(90), fontWeight: 400, color: "#000" }}>
        What works well!
      </p>
      {/* Subtitle */}
      <p style={{ ...abs(86, 337), ...f(0.05), fontSize: fs(32), color: "#000" }}>
        UniFi App
      </p>
      {/* Text block */}
      <div style={{ ...abs(86, 455), width: wp(729), ...f(0.1) }}>
        <p style={{ fontSize: fs(24), fontWeight: 700, color: "#000", marginBottom: "0.5em" }}>
          Design Opportunity
        </p>
        <p style={{ fontSize: fs(24), color: "#000", lineHeight: 1.65, marginBottom: "0.8em" }}>
          Following a factory reset, the setup flow is smooth, visually guided, and easy to follow.
          The experience provides clear, step-by-step feedback during connection, helping users understand
          what is happening without requiring technical knowledge.
        </p>
        <p style={{ fontSize: fs(24), color: "#000", lineHeight: 1.65 }}>
          Animations and progress indicators reinforce system activity and create a sense of control,
          reducing uncertainty during the process. The pacing feels well-balanced, allowing users to
          move forward with confidence.
        </p>
      </div>

      {/* ── Circular illustration ── */}
      {/* Outer radial-gradient ring */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/s5-ring-outer.svg" alt=""
        style={{ ...abs(1119, 171), width: wp(615), height: hp(615), ...f(0.15) }} />
      {/* Inner glow circle */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/s5-ring-inner.png" alt=""
        style={{ ...abs(1142, 194), width: wp(568), height: hp(568), ...f(0.2) }} />
      {/* Router device */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/s5-router.png" alt=""
        style={{ ...abs(1322, 317), width: wp(208), objectFit: "contain", ...f(0.25) }} />
      {/* Blue arc — slow spin */}
      <div style={{
        ...abs(1475, 238), width: wp(307), height: hp(274),
        ...f(0.3),
        animation: v ? "spin-arc 12s linear infinite" : "none",
        transformOrigin: `${((1426 - 1475) / 307) * 100}% ${((478 - 238) / 274) * 100}%`,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/s5-arc.svg" alt="" style={{ width: "100%", height: "100%" }} />
      </div>

      {/* "Connecting..." label — centered at x=1425.5 */}
      <p style={{
        ...abs(1425.5, 830),
        transform: "translateX(-50%)",
        width: wp(591),
        ...f(0.35),
        fontSize: fs(50), fontWeight: 500, color: "#000", textAlign: "center",
      }}>
        Connecting...
      </p>
    </div>
  );
}

// ── SLIDE 3 — FIRST IMPRESSION ───────────────────────────────────────────────
// Figma node 43:109  "Slide 16:9 - 3"
function Slide3() {
  const [ref, v] = useVisible();
  const f = (d: number): CSSProperties => ({
    opacity: v ? 1 : 0,
    transition: `opacity 0.5s ease ${d}s`,
  });

  // Annotation bubble style
  const bubble = (color: "orange" | "blue" | "red"): CSSProperties => ({
    padding: `${fs(12)} ${fs(16)}`,
    borderRadius: fs(16),
    fontSize: fs(18),
    color: "#0b182c",
    lineHeight: 1.4,
    background:
      color === "orange" ? "#fff3e8" :
      color === "red"    ? "#ffe8e8" :
                           "#e9f1ff",
    border: `1px solid ${
      color === "orange" ? "#ffe3cc" :
      color === "red"    ? "#fcdada" :
                           "#d3e2ff"
    }`,
  });

  // Thin connector line
  const hLine = (l: number, t: number, w_: number, delay: number): React.ReactNode => (
    <div style={{ ...abs(l, t), width: wp(w_), height: "1px", background: "#d6d8db", ...f(delay) }} />
  );

  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, background: "#fff" }}>
      {/* Title */}
      <p style={{ ...abs(86, 200), ...f(0), fontSize: fs(90), fontWeight: 400, color: "#000" }}>
        First impression
      </p>
      {/* Subtitle */}
      <p style={{ ...abs(86, 319), ...f(0.05), fontSize: fs(32), color: "#000" }}>
        UniFi App
      </p>

      {/* Phone screenshot */}
      <div style={{
        ...abs(1123, 73),
        width: wp(445), height: hp(963),
        borderRadius: fs(50), border: "1px solid #d6d8db",
        overflow: "hidden",
        ...f(0.1),
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/unifi-original.png" alt="Original UniFi App"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>

      {/* Bullet list */}
      <ul style={{
        ...abs(106, 457), width: wp(650),
        fontSize: fs(24), color: "#000", lineHeight: 2.1,
        listStyleType: "disc", paddingLeft: "1.3em",
        ...f(0.15),
      }}>
        {[
          "No clear system status",
          "Technical labels require prior knowledge",
          "Navigation lacks clarity",
          "External apps open without indication",
        ].map((item, i) => <li key={i}>{item}</li>)}
      </ul>

      {/* ── Left annotation bubbles ── */}
      <div style={{ ...abs(809, 124),    width: wp(260), ...bubble("orange"), ...f(0.20) }}>Device name truncated</div>
      <div style={{ ...abs(809, 188.62), width: wp(260), ...bubble("blue"),   ...f(0.22) }}>Technical jargon</div>
      <div style={{ ...abs(809, 305.53), width: wp(260), ...bubble("red"),    ...f(0.24) }}>No clear network status</div>
      <div style={{ ...abs(809, 546),    width: wp(260), ...bubble("blue"),   ...f(0.26) }}>Technical label</div>
      <div style={{ ...abs(809, 941),    width: wp(260), ...bubble("orange"), ...f(0.28) }}>Icon-only navigation</div>

      {/* ── Right annotation bubbles ── */}
      <div style={{ ...abs(1621, 196), width: wp(260), ...bubble("blue"),   ...f(0.30) }}>Unlabeled icons</div>
      <div style={{ ...abs(1621, 365), width: wp(260), ...bubble("blue"),   ...f(0.32) }}>Static data prioritized over live performance</div>
      <div style={{ ...abs(1621, 645), width: wp(260), ...bubble("red"),    ...f(0.34) }}>Real-time performance is not surfaced as a primary signal</div>
      <div style={{ ...abs(1621, 764), width: wp(260), ...bubble("blue"),   ...f(0.36) }}>Inconsistent behavior across shortcuts</div>

      {/* ── Left connecting lines ── */}
      {hLine(1069, 151, 54, 0.25)}
      {hLine(1069, 217, 54, 0.25)}
      {hLine(1069, 575, 54, 0.25)}
      {hLine(1069, 969, 54, 0.25)}

      {/* ── Right connecting lines ── */}
      {hLine(1568, 225, 53, 0.35)}
      {hLine(1596, 404, 25, 0.35)}
      {hLine(1568, 695, 53, 0.35)}
      {hLine(1568, 801, 53, 0.35)}

      {/* Diagonal connector — "No clear network status" */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
        <line
          x1={`${(1069 / 1920) * 100}%`} y1={`${(311 / 1080) * 100}%`}
          x2={`${(1123 / 1920) * 100}%`} y2={`${(254 / 1080) * 100}%`}
          stroke="#d6d8db" strokeWidth="1"
          strokeOpacity={v ? 1 : 0}
          style={{ transition: "stroke-opacity 0.5s ease 0.25s" }}
        />
      </svg>

      {/* Priority bar (right side) */}
      <div style={{ ...abs(1566, 268), width: wp(30), height: hp(272), borderRadius: 4, overflow: "hidden", ...f(0.4) }}>
        <div style={{ height: "36%", background: "#ef4444" }} />
        <div style={{ height: "32%", background: "#0073f1" }} />
        <div style={{ height: "32%", background: "#fb923c" }} />
      </div>

      {/* Severity legend */}
      <div style={{ ...abs(1622, 899), display: "flex", flexDirection: "column", gap: fs(8), ...f(0.45) }}>
        {([
          { l: "High",   c: "#ef4444" },
          { l: "Medium", c: "#0073f1" },
          { l: "Low",    c: "#fb923c" },
        ] as const).map(({ l, c }) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: fs(8) }}>
            <div style={{ width: fs(20), height: fs(20), borderRadius: "50%", background: c, flexShrink: 0 }} />
            <span style={{ fontSize: fs(18), color: "#0b182c" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SOLUTION — LIVE APP ───────────────────────────────────────────────────────
// Adapted from Figma node 108:82  "Slide 16:9 - 6"
function SolutionSlide() {
  const [ref, v] = useVisible();
  const f = (d: number): CSSProperties => ({
    opacity: v ? 1 : 0,
    transition: `opacity 0.65s ease ${d}s`,
  });
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, background: "#fff" }}>
      {/* Title */}
      <p style={{ ...abs(86, 110), ...f(0), fontSize: fs(90), fontWeight: 400, color: "#000" }}>
        First impression
      </p>
      {/* Subtitle */}
      <p style={{ ...abs(86, 247), ...f(0.05), fontSize: fs(32), color: "#000" }}>
        UniFi App
      </p>
      {/* Design opportunity text */}
      <div style={{ ...abs(86, 345), width: wp(650), ...f(0.1) }}>
        <p style={{ fontSize: fs(24), fontWeight: 700, color: "#000", marginBottom: "0.4em" }}>
          Design Opportunity
        </p>
        <p style={{ fontSize: fs(24), color: "#000", lineHeight: 1.65 }}>
          There is an opportunity to introduce a clearer status layer that communicates network
          health upfront and highlights relevant issues, reducing the need to interpret raw data
          while preserving access to detailed insights.
        </p>
      </div>
      {/* Phone frame with live app */}
      <div style={{
        ...abs(1146, 60),
        width: wp(430), height: hp(932),
        borderRadius: fs(50),
        overflow: "hidden",
        border: "1px solid #f2f2f2",
        boxShadow: "0 28px 50px rgba(0,0,0,0.12)",
        ...f(0.15),
      }}>
        <iframe
          src="/"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          title="Redesigned UniFi App"
        />
      </div>
    </div>
  );
}
