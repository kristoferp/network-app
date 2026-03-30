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
const fs = (px: number) => `${px / 19.2}vw`;
const wp = (px: number) => `${(px / 1920) * 100}%`;
const hp = (px: number) => `${(px / 1080) * 100}%`;
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

// ── Mobile breakpoint hook ───────────────────────────────────────────────────
function useMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 900);
    fn();
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return m;
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function CaseStudy() {
  const [active, setActive] = useState("intro");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const mobile = useMobile();

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

      {/* ── Side nav — hidden on mobile ── */}
      {!mobile && (
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
      )}

      {/* ══ SLIDE 1 — HERO ══════════════════════════════════════════════════ */}
      <section id="intro" ref={(el) => reg("intro")(el as HTMLElement | null)}>
        {mobile ? <Slide1Mobile /> : <SlideCanvas><Slide1 /></SlideCanvas>}
      </section>

      {/* ══ SLIDE 2 — TIMELINE ══════════════════════════════════════════════ */}
      <section id="timeline" ref={(el) => reg("timeline")(el as HTMLElement | null)}>
        {mobile ? <Slide2Mobile /> : <SlideCanvas><Slide2 /></SlideCanvas>}
      </section>

      {/* ══ SLIDE 5 — WHAT WORKS WELL ═══════════════════════════════════════ */}
      <section id="works-well" ref={(el) => reg("works-well")(el as HTMLElement | null)}>
        {mobile ? <Slide5Mobile /> : <SlideCanvas><Slide5 /></SlideCanvas>}
      </section>

      {/* ══ SLIDE 3 — FIRST IMPRESSION ══════════════════════════════════════ */}
      <section id="impression" ref={(el) => reg("impression")(el as HTMLElement | null)}>
        {mobile ? <Slide3Mobile /> : <SlideCanvas><Slide3 /></SlideCanvas>}
      </section>

      {/* ══ SOLUTION — LIVE APP ════════════════════════════════════════════= */}
      <section id="solution" ref={(el) => reg("solution")(el as HTMLElement | null)}>
        <SolutionSlide mobile={mobile} />
      </section>

      <footer style={{ padding: "32px 0", textAlign: "center", borderTop: "1px solid #f0f0f0" }}>
        <p style={{ fontSize: 12, color: "#c0c4cb" }}>Kristofer Pallfy · UX Design Case Study · 2025</p>
      </footer>
    </div>
  );
}

// ── 16:9 slide container (desktop only) ─────────────────────────────────────
function SlideCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}

// ── Mobile section wrapper ───────────────────────────────────────────────────
function MobileSection({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      minHeight: "100svh",
      padding: "72px 28px 64px",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 32,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── SLIDE 1 — HERO (desktop) ─────────────────────────────────────────────────
function Slide1() {
  const [ref, v] = useVisible();
  const f = (d: number): CSSProperties => ({
    opacity: v ? 1 : 0,
    transition: `opacity 0.65s ease ${d}s`,
  });
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, background: "#fff" }}>
      <p style={{ ...abs(86, 200), ...f(0), fontSize: fs(90), fontWeight: 400, color: "#000", lineHeight: 1.1, width: wp(956) }}>
        What does a home user see when they open the app?
      </p>
      <p style={{ ...abs(83, 667), ...f(0.2), fontSize: fs(44), fontWeight: 700, color: "#000", width: wp(923) }}>
        UniFi Dream 7 router
      </p>
      <div style={{ ...abs(86, 743), ...f(0.28), width: wp(1079), height: "1px", background: "#0073f1" }} />
      <p style={{ ...abs(86, 763), ...f(0.32), fontSize: fs(32), fontWeight: 400, color: "#000" }}>
        Kristofer Pallfy - UX-review
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/router.png" alt="UniFi Dream Router 7"
        style={{ ...abs(1224, 155), ...f(0.1), width: wp(459), objectFit: "contain" }} />
    </div>
  );
}

// ── SLIDE 1 — HERO (mobile) ──────────────────────────────────────────────────
function Slide1Mobile() {
  const [ref, v] = useVisible(0.05);
  const f = (d: number): CSSProperties => ({ opacity: v ? 1 : 0, transition: `opacity 0.65s ease ${d}s` });
  return (
    <MobileSection>
      <div ref={ref}>
        <h1 style={{ fontSize: "clamp(34px,9vw,58px)", fontWeight: 400, color: "#000", lineHeight: 1.15, ...f(0) }}>
          What does a home user see when they open the app?
        </h1>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/router.png" alt="UniFi Dream Router 7"
        style={{ width: "52%", maxWidth: 200, objectFit: "contain", margin: "0 auto", display: "block", ...f(0.1) }} />
      <div style={f(0.2)}>
        <p style={{ fontSize: 20, fontWeight: 700, color: "#000", marginBottom: 10 }}>UniFi Dream 7 router</p>
        <div style={{ height: 1, background: "#0073f1", marginBottom: 10 }} />
        <p style={{ fontSize: 14, color: "#555" }}>Kristofer Pallfy - UX-review</p>
      </div>
    </MobileSection>
  );
}

// ── SLIDE 2 — TIMELINE (desktop) ─────────────────────────────────────────────
function Slide2() {
  const [ref, v] = useVisible();
  const f = (d: number): CSSProperties => ({
    opacity: v ? 1 : 0,
    transition: `opacity 0.5s ease ${d}s`,
  });
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, background: "#fff" }}>
      <p style={{ ...abs(86, 200), ...f(0), fontSize: fs(90), fontWeight: 400, color: "#000" }}>
        Getting started - timeline
      </p>
      <p style={{ ...abs(86, 337), ...f(0.05), fontSize: fs(32), color: "#000" }}>
        UniFi Dream 7 router + UniFi App
      </p>

      {/* Gray base line */}
      <div style={{ ...abs(86, 517), width: wp(1632), height: "1px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "#d1d5db", width: v ? "100%" : "0%", transition: "width 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s" }} />
      </div>
      {/* Red dashed segment — matches box border style */}
      <div style={{ ...abs(387, 514), height: "2px", overflow: "hidden", width: wp(745) }}>
        <div style={{
          height: "100%",
          backgroundImage: "repeating-linear-gradient(90deg, #ef4444 0px, #ef4444 6px, transparent 6px, transparent 12px)",
          width: v ? "100%" : "0%",
          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1) 0.8s",
        }} />
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

      <p style={{ ...abs(1745, 490), ...f(0.6), fontSize: fs(34) }}>🎉</p>

      <p style={{ ...abs(86,   545), ...f(0.20), fontSize: fs(24), color: "#000" }}>App opened</p>
      <p style={{ ...abs(336,  545), ...f(0.25), fontSize: fs(24), color: "#000" }}>0 devices found</p>
      <p style={{ ...abs(1081, 545), ...f(0.40), fontSize: fs(24), color: "#000" }}>Factory reset</p>
      <p style={{ ...abs(1308, 545), ...f(0.45), fontSize: fs(24), color: "#000" }}>Connected</p>
      <p style={{ ...abs(1522, 545), ...f(0.50), fontSize: fs(24), color: "#000" }}>Setup Complete!</p>

      {/* Dashed red box with text inside — equal padding all sides */}
      <div style={{
        ...abs(577, 543),
        width: wp(476),
        border: "1px dashed #ef4444", borderRadius: 4,
        padding: fs(18),
        opacity: v ? 1 : 0, transition: "opacity 0.5s ease 0.3s",
      }}>
        <p style={{ fontSize: fs(24), color: "#000", lineHeight: 1.5 }}>
          Troubleshooting, testing different ports etc. Called ISP (bridged a port).
        </p>
        <p style={{ fontSize: fs(24), color: "#ef4444", fontWeight: 500, marginTop: "0.3em" }}>
          App guidance did not help
        </p>
      </div>

      <p style={{ ...abs(967, 889), width: wp(443), ...f(0.7), fontSize: fs(24), color: "#000", lineHeight: 1.55 }}>
        There is a help section in the app but nothing about resetting to factory settings.
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/help-screen.png" alt="UniFi Help Screen"
        style={{ ...abs(1395, 673), width: wp(355), borderRadius: fs(50), boxShadow: "0 4px 24px rgba(0,0,0,0.15)", ...f(0.65) }} />

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

// ── SLIDE 2 — TIMELINE (mobile) ──────────────────────────────────────────────
const TIMELINE_EVENTS = [
  { time: "07:57", label: "App opened",      red: false },
  { time: "08:00", label: "0 devices found", red: false },
  { time: "1h 22m", label: "Troubleshooting — testing ports, called ISP.\nApp guidance did not help.", red: true },
  { time: "09:22", label: "Factory reset",   red: false },
  { time: "09:23", label: "Connected",       red: false },
  { time: "09:24", label: "Setup Complete! 🎉", red: false },
];

function Slide2Mobile() {
  const [ref, v] = useVisible(0.05);
  const f = (d: number): CSSProperties => ({ opacity: v ? 1 : 0, transition: `opacity 0.5s ease ${d}s` });
  return (
    <MobileSection>
      <div ref={ref} style={f(0)}>
        <h2 style={{ fontSize: "clamp(34px,9vw,58px)", fontWeight: 400, color: "#000", lineHeight: 1.15, marginBottom: 8 }}>
          Getting started - timeline
        </h2>
        <p style={{ fontSize: 16, color: "#000" }}>UniFi Dream 7 router + UniFi App</p>
      </div>

      {/* Vertical timeline */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {TIMELINE_EVENTS.map((evt, i) => (
          <div key={i} style={{ display: "flex", gap: 16, ...f(0.1 + i * 0.08) }}>
            {/* Dot + line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 16 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: evt.red ? "#ef4444" : "#d1d5db",
                flexShrink: 0, marginTop: 5,
              }} />
              {i < TIMELINE_EVENTS.length - 1 && (
                <div style={{ width: 2, flex: 1, minHeight: 24, background: evt.red ? "#fca5a5" : "#e5e7eb" }} />
              )}
            </div>
            {/* Content */}
            <div style={{ paddingBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: evt.red ? "#ef4444" : "#9da1a7", marginBottom: 3 }}>
                {evt.time}
              </p>
              <p style={{ fontSize: 15, color: evt.red ? "#ef4444" : "#0b182c", lineHeight: 1.55, whiteSpace: "pre-line" }}>
                {evt.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div style={{ padding: "16px", background: "#fff8f8", borderRadius: 10, border: "1px solid #fecaca", ...f(0.7) }}>
        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.55 }}>
          There is a help section in the app but nothing about resetting to factory settings.
        </p>
      </div>
    </MobileSection>
  );
}

// ── SLIDE 5 — WHAT WORKS WELL (desktop) ──────────────────────────────────────
function Slide5() {
  const [ref, v] = useVisible();
  const f = (d: number): CSSProperties => ({
    opacity: v ? 1 : 0,
    transition: `opacity 0.6s ease ${d}s`,
  });
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, background: "#fff" }}>
      <p style={{ ...abs(86, 220), ...f(0), fontSize: fs(90), fontWeight: 400, color: "#000" }}>
        What works well!
      </p>
      <p style={{ ...abs(86, 337), ...f(0.05), fontSize: fs(32), color: "#000" }}>
        UniFi App
      </p>
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

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/s5-ring-outer.svg" alt="" style={{ ...abs(1119, 171), width: wp(615), height: hp(615), ...f(0.15) }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/s5-ring-inner.png" alt="" style={{ ...abs(1142, 194), width: wp(568), height: hp(568), ...f(0.2) }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/s5-router.png" alt="" style={{ ...abs(1322, 317), width: wp(208), objectFit: "contain", ...f(0.25) }} />
      <div style={{
        ...abs(1475, 238), width: wp(307), height: hp(274),
        ...f(0.3),
        animation: v ? "spin-arc 12s linear infinite" : "none",
        transformOrigin: `${((1426 - 1475) / 307) * 100}% ${((478 - 238) / 274) * 100}%`,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/s5-arc.svg" alt="" style={{ width: "100%", height: "100%" }} />
      </div>
      <p style={{
        ...abs(1425.5, 830), transform: "translateX(-50%)", width: wp(591),
        ...f(0.35), fontSize: fs(50), fontWeight: 500, color: "#000", textAlign: "center",
      }}>
        Connecting...
      </p>
    </div>
  );
}

// ── SLIDE 5 — WHAT WORKS WELL (mobile) ───────────────────────────────────────
function Slide5Mobile() {
  const [ref, v] = useVisible(0.05);
  const f = (d: number): CSSProperties => ({ opacity: v ? 1 : 0, transition: `opacity 0.6s ease ${d}s` });
  return (
    <MobileSection>
      <div ref={ref} style={f(0)}>
        <h2 style={{ fontSize: "clamp(34px,9vw,58px)", fontWeight: 400, color: "#000", lineHeight: 1.15, marginBottom: 8 }}>
          What works well!
        </h2>
        <p style={{ fontSize: 16, color: "#000" }}>UniFi App</p>
      </div>

      {/* Illustration */}
      <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto", flexShrink: 0, ...f(0.1) }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/s5-ring-outer.svg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/s5-ring-inner.png" alt="" style={{ position: "absolute", inset: "4%", width: "92%", height: "92%" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/s5-router.png" alt="" style={{ position: "absolute", left: "28%", top: "22%", width: "44%", objectFit: "contain" }} />
        <div style={{
          position: "absolute", right: "-8%", top: "4%", width: "55%", height: "55%",
          animation: v ? "spin-arc 12s linear infinite" : "none",
          transformOrigin: "20% 90%",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/s5-arc.svg" alt="" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      <p style={{ fontSize: 22, fontWeight: 500, textAlign: "center", color: "#000", ...f(0.2) }}>
        Connecting...
      </p>

      <div style={f(0.3)}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#000", marginBottom: 8 }}>Design Opportunity</p>
        <p style={{ fontSize: 15, color: "#333", lineHeight: 1.65, marginBottom: 12 }}>
          Following a factory reset, the setup flow is smooth, visually guided, and easy to follow.
        </p>
        <p style={{ fontSize: 15, color: "#333", lineHeight: 1.65 }}>
          Animations and progress indicators reinforce system activity and create a sense of control.
        </p>
      </div>
    </MobileSection>
  );
}

// ── SLIDE 3 — FIRST IMPRESSION (desktop) ─────────────────────────────────────
function Slide3() {
  const [ref, v] = useVisible();
  const f = (d: number): CSSProperties => ({
    opacity: v ? 1 : 0,
    transition: `opacity 0.5s ease ${d}s`,
  });

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

  const hLine = (l: number, t: number, w_: number, delay: number): React.ReactNode => (
    <div style={{ ...abs(l, t), width: wp(w_), height: "1px", background: "#d6d8db", ...f(delay) }} />
  );

  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, background: "#fff" }}>
      <p style={{ ...abs(86, 200), ...f(0), fontSize: fs(90), fontWeight: 400, color: "#000" }}>
        First impression
      </p>
      <p style={{ ...abs(86, 319), ...f(0.05), fontSize: fs(32), color: "#000" }}>
        UniFi App
      </p>

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

      <div style={{ ...abs(809, 124),    width: wp(260), ...bubble("orange"), ...f(0.20) }}>Device name truncated</div>
      <div style={{ ...abs(809, 188.62), width: wp(260), ...bubble("blue"),   ...f(0.22) }}>Technical jargon</div>
      <div style={{ ...abs(809, 305.53), width: wp(260), ...bubble("red"),    ...f(0.24) }}>No clear network status</div>
      <div style={{ ...abs(809, 546),    width: wp(260), ...bubble("blue"),   ...f(0.26) }}>Technical label</div>
      <div style={{ ...abs(809, 941),    width: wp(260), ...bubble("orange"), ...f(0.28) }}>Icon-only navigation</div>

      <div style={{ ...abs(1621, 196), width: wp(260), ...bubble("blue"),   ...f(0.30) }}>Unlabeled icons</div>
      <div style={{ ...abs(1621, 365), width: wp(260), ...bubble("blue"),   ...f(0.32) }}>Static data prioritized over live performance</div>
      <div style={{ ...abs(1621, 645), width: wp(260), ...bubble("red"),    ...f(0.34) }}>Real-time performance is not surfaced as a primary signal</div>
      <div style={{ ...abs(1621, 764), width: wp(260), ...bubble("blue"),   ...f(0.36) }}>Inconsistent behavior across shortcuts</div>

      {hLine(1069, 151, 54, 0.25)}
      {hLine(1069, 217, 54, 0.25)}
      {hLine(1069, 575, 54, 0.25)}
      {hLine(1069, 969, 54, 0.25)}
      {hLine(1568, 225, 53, 0.35)}
      {hLine(1596, 404, 25, 0.35)}
      {hLine(1568, 695, 53, 0.35)}
      {hLine(1568, 801, 53, 0.35)}

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
        <line
          x1={`${(1069 / 1920) * 100}%`} y1={`${(311 / 1080) * 100}%`}
          x2={`${(1123 / 1920) * 100}%`} y2={`${(254 / 1080) * 100}%`}
          stroke="#d6d8db" strokeWidth="1"
          strokeOpacity={v ? 1 : 0}
          style={{ transition: "stroke-opacity 0.5s ease 0.25s" }}
        />
      </svg>

      <div style={{ ...abs(1566, 268), width: wp(30), height: hp(272), borderRadius: 4, overflow: "hidden", ...f(0.4) }}>
        <div style={{ height: "36%", background: "#ef4444" }} />
        <div style={{ height: "32%", background: "#0073f1" }} />
        <div style={{ height: "32%", background: "#fb923c" }} />
      </div>

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

// ── SLIDE 3 — FIRST IMPRESSION (mobile) ──────────────────────────────────────
function Slide3Mobile() {
  const [ref, v] = useVisible(0.05);
  const f = (d: number): CSSProperties => ({ opacity: v ? 1 : 0, transition: `opacity 0.5s ease ${d}s` });

  const bubble = (color: "orange" | "blue" | "red"): CSSProperties => ({
    padding: "8px 12px",
    borderRadius: 10,
    fontSize: 13,
    color: "#0b182c",
    lineHeight: 1.4,
    background: color === "orange" ? "#fff3e8" : color === "red" ? "#ffe8e8" : "#e9f1ff",
    border: `1px solid ${color === "orange" ? "#ffe3cc" : color === "red" ? "#fcdada" : "#d3e2ff"}`,
  });

  return (
    <MobileSection>
      <div ref={ref} style={f(0)}>
        <h2 style={{ fontSize: "clamp(34px,9vw,58px)", fontWeight: 400, color: "#000", lineHeight: 1.15, marginBottom: 8 }}>
          First impression
        </h2>
        <p style={{ fontSize: 16, color: "#000" }}>UniFi App</p>
      </div>

      {/* Phone + annotations side by side */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", ...f(0.1) }}>
        {/* Phone screenshot */}
        <div style={{
          width: "42%", flexShrink: 0,
          borderRadius: 20, border: "1px solid #d6d8db",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/unifi-original.png" alt="Original UniFi App"
            style={{ width: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
        </div>

        {/* Annotation bubbles */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
          <div style={bubble("orange")}>Device name truncated</div>
          <div style={bubble("blue")}>Technical jargon</div>
          <div style={bubble("red")}>No clear network status</div>
          <div style={bubble("blue")}>Technical label</div>
          <div style={bubble("orange")}>Icon-only navigation</div>
        </div>
      </div>

      {/* Bullet list */}
      <ul style={{ fontSize: 15, color: "#000", lineHeight: 2, listStyleType: "disc", paddingLeft: "1.3em", ...f(0.2) }}>
        {[
          "No clear system status",
          "Technical labels require prior knowledge",
          "Navigation lacks clarity",
          "External apps open without indication",
        ].map((item, i) => <li key={i}>{item}</li>)}
      </ul>

      {/* Severity legend */}
      <div style={{ display: "flex", gap: 20, ...f(0.3) }}>
        {([
          { l: "High",   c: "#ef4444" },
          { l: "Medium", c: "#0073f1" },
          { l: "Low",    c: "#fb923c" },
        ] as const).map(({ l, c }) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#0b182c" }}>{l}</span>
          </div>
        ))}
      </div>
    </MobileSection>
  );
}

// ── SOLUTION — LIVE APP (responsive) ─────────────────────────────────────────
// Phone renders at native 390×844, then scaled to fit the container
const PHONE_W = 390;
const PHONE_H = 844;

function PhoneMockup({ containerWidth }: { containerWidth: number }) {
  const scale = Math.min(containerWidth / PHONE_W, 1);
  const displayW = PHONE_W * scale;
  const displayH = PHONE_H * scale;
  return (
    <div style={{
      width: displayW,
      height: displayH,
      overflow: "hidden",
      borderRadius: 44 * scale,
      border: "1px solid #f2f2f2",
      boxShadow: "0 28px 50px rgba(0,0,0,0.12)",
      flexShrink: 0,
    }}>
      <div style={{
        width: PHONE_W,
        height: PHONE_H,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}>
        <iframe
          src="/"
          style={{ width: PHONE_W, height: PHONE_H, border: "none", display: "block" }}
          title="Redesigned UniFi App"
        />
      </div>
    </div>
  );
}

function SolutionSlide({ mobile }: { mobile: boolean }) {
  const [ref, v] = useVisible(0.05);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phoneContainerW, setPhoneContainerW] = useState(390);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      // Mobile: phone takes full width minus padding; desktop: right half of layout
      setPhoneContainerW(mobile ? Math.min(w * 0.88, PHONE_W) : Math.min(w * 0.42, PHONE_W));
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, [mobile]);

  const f = (d: number): CSSProperties => ({ opacity: v ? 1 : 0, transition: `opacity 0.65s ease ${d}s` });

  const textBlock = (
    <div style={f(0)}>
      <h2 style={{
        fontSize: mobile ? "clamp(34px,9vw,58px)" : "clamp(32px,3.5vw,58px)",
        fontWeight: 400, color: "#000", lineHeight: 1.15, marginBottom: 12,
      }}>
        First impression
      </h2>
      <p style={{ fontSize: mobile ? 16 : 18, color: "#000", marginBottom: 24 }}>UniFi App</p>
      <p style={{ fontSize: mobile ? 13 : 15, fontWeight: 700, color: "#000", marginBottom: 8 }}>
        Design Opportunity
      </p>
      <p style={{ fontSize: mobile ? 14 : 15, color: "#333", lineHeight: 1.65 }}>
        There is an opportunity to introduce a clearer status layer that communicates network
        health upfront and highlights relevant issues, reducing the need to interpret raw data
        while preserving access to detailed insights.
      </p>
    </div>
  );

  return (
    <div
      ref={(el) => {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      style={{
        minHeight: "100svh",
        padding: mobile ? "72px 28px 64px" : "0 80px",
        background: "#fff",
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        alignItems: "center",
        justifyContent: mobile ? "center" : "space-between",
        gap: mobile ? 40 : 48,
      }}
    >
      <div style={{ flex: mobile ? undefined : "0 0 45%", maxWidth: mobile ? undefined : 560 }}>
        {textBlock}
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: mobile ? undefined : "0 0 50%",
        ...f(0.15),
      }}>
        <PhoneMockup containerWidth={phoneContainerW} />
      </div>
    </div>
  );
}
