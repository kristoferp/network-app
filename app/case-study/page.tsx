"use client";
import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  { id: "intro",      label: "Intro" },
  { id: "timeline",   label: "Timeline" },
  { id: "works-well", label: "What works well" },
  { id: "impression", label: "First impression" },
  { id: "solution",   label: "Solution" },
];

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

  const reg = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };
  const scrollTo = (id: string) => sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Google Sans', sans-serif", background: "#fff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fade { opacity: 0; transform: translateY(28px); transition: opacity 0.75s ease, transform 0.75s ease; }
        .fade.on { opacity: 1; transform: translateY(0); }
        .fade.on.d1 { transition-delay: 0.1s; }
        .fade.on.d2 { transition-delay: 0.2s; }
        .fade.on.d3 { transition-delay: 0.3s; }
        .fade.on.d4 { transition-delay: 0.4s; }
        @keyframes spin-arc {
          from { stroke-dashoffset: 502; }
          to   { stroke-dashoffset: 0; }
        }
        .arc-path { animation: spin-arc 2.5s ease-in-out infinite alternate; }
      `}</style>

      {/* ── Side nav (desktop) ── */}
      <nav style={{ position: "fixed", right: 28, top: "50%", transform: "translateY(-50%)", zIndex: 100, display: "flex", flexDirection: "column", gap: 12 }}>
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => scrollTo(s.id)}
            title={s.label}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "2px 0" }}>
            <span style={{ fontSize: 11, color: "#9da1a7", opacity: active === s.id ? 1 : 0, transition: "opacity 0.2s", whiteSpace: "nowrap" }}>{s.label}</span>
            <span style={{
              display: "block", borderRadius: "50%",
              width: active === s.id ? 8 : 6, height: active === s.id ? 8 : 6,
              background: active === s.id ? "#0073f1" : "#d1d5db",
              transition: "all 0.25s",
            }}/>
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════════
          SLIDE 1 — HERO
      ══════════════════════════════════════════ */}
      <section id="intro" ref={reg("intro")}
        style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 8vw", background: "#ffffff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, alignItems: "center" }}>
          {/* Left: text */}
          <Fade>
            <h1 style={{ fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 400, color: "#000", lineHeight: 1.15, marginBottom: 48, maxWidth: 520 }}>
              What does a home user see when they open the app?
            </h1>
            <div style={{ maxWidth: 400 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#000", marginBottom: 10 }}>UniFi Dream 7 router</p>
              <div style={{ height: 1, background: "#0073f1", marginBottom: 10 }}/>
              <p style={{ fontSize: 14, fontWeight: 400, color: "#555" }}>Kristofer Pallfy - UX-review</p>
            </div>
          </Fade>
          {/* Right: router photo */}
          <Fade delay="d1">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/router.png" alt="UniFi Dream Router 7" style={{ width: "100%", maxWidth: 380, objectFit: "contain" }}/>
            </div>
          </Fade>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 2 — TIMELINE
      ══════════════════════════════════════════ */}
      <section id="timeline" ref={reg("timeline")}
        style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", padding: "80px 6vw 80px", background: "#fff" }}>
        <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto" }}>

          {/* Title */}
          <Fade>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 72px)", fontWeight: 400, color: "#000", lineHeight: 1.1, marginBottom: 12 }}>Getting started - timeline</h2>
            <p style={{ fontSize: "clamp(14px, 1.6vw, 24px)", color: "#000", marginBottom: 56 }}>UniFi Dream 7 router + UniFi App</p>
          </Fade>

          {/* Timeline track */}
          <TimelineSection />

          {/* Bottom: note + phone screenshot */}
          <Fade delay="d3">
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "flex-start", marginTop: 40 }}>
              {/* Note text */}
              <div style={{ paddingLeft: "32%" }}>
                <p style={{ fontSize: "clamp(13px, 1.4vw, 20px)", color: "#000", lineHeight: 1.6, maxWidth: 420 }}>
                  There is a help section in the app but nothing about resetting to factory settings.
                </p>
              </div>
              {/* Phone screenshot */}
              <div style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/device-setup-help.png"
                  alt="Device Setup Help screen"
                  style={{ width: 220, borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", display: "block" }}
                />
              </div>
            </div>
          </Fade>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 5 — WHAT WORKS WELL
      ══════════════════════════════════════════ */}
      <section id="works-well" ref={reg("works-well")}
        style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 8vw", background: "linear-gradient(150deg, #f5f9ff 0%, #ffffff 55%)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <Fade>
              <Label>Strengths</Label>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 700, color: "#0b182c", margin: "12px 0 6px" }}>What works well!</h2>
              <p style={{ fontSize: 14, color: "#9da1a7", marginBottom: 40 }}>UniFi App</p>
            </Fade>
            <Fade delay="d1">
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0b182c", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Design Opportunity</p>
              <p style={{ fontSize: 15, color: "#5f6369", lineHeight: 1.7, marginBottom: 20 }}>
                Following a factory reset, the setup flow is smooth, visually guided, and easy to follow. The experience provides clear, step-by-step feedback during connection, helping users understand what is happening without requiring technical knowledge.
              </p>
              <p style={{ fontSize: 15, color: "#5f6369", lineHeight: 1.7 }}>
                Animations and progress indicators reinforce system activity and create a sense of control, reducing uncertainty during the process. The pacing feels well-balanced, allowing users to move forward with confidence.
              </p>
            </Fade>
          </div>
          <Fade delay="d2">
            <ConnectingIllustration />
          </Fade>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SLIDE 3 — FIRST IMPRESSION
      ══════════════════════════════════════════ */}
      <section id="impression" ref={reg("impression")}
        style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 8vw", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          <div>
            <Fade>
              <Label>Findings</Label>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 700, color: "#0b182c", margin: "12px 0 6px" }}>First impression</h2>
              <p style={{ fontSize: 14, color: "#9da1a7", marginBottom: 40 }}>UniFi App</p>
            </Fade>
            <Fade delay="d1">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "No clear system status",
                  "Technical labels require prior knowledge",
                  "Navigation lacks clarity",
                  "External apps open without indication",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 12, background: "#fafafa", border: "1px solid #f0f0f0" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }}/>
                    <p style={{ fontSize: 14, color: "#0b182c" }}>{item}</p>
                  </div>
                ))}
              </div>
            </Fade>
          </div>

          {/* Annotated app mockup */}
          <Fade delay="d2">
            <AppAnnotation />
          </Fade>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SOLUTION — THE APP
      ══════════════════════════════════════════ */}
      <section id="solution" ref={reg("solution")}
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 8vw", background: "linear-gradient(150deg, #f5f9ff 0%, #ffffff 55%)" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Label>The Solution</Label>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 700, color: "#0b182c", margin: "12px 0 12px" }}>
              The redesigned experience
            </h2>
            <p style={{ fontSize: 15, color: "#5f6369", maxWidth: 480, margin: "0 auto" }}>
              A live, interactive prototype. Scroll and tap to explore the new interface.
            </p>
          </div>
        </Fade>

        <Fade delay="d1">
          <div style={{ position: "relative", width: 390 }}>
            {/* Phone shell */}
            <div style={{
              borderRadius: 52, overflow: "hidden",
              border: "10px solid #1a1a1a",
              boxShadow: "0 40px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.06) inset",
              background: "#1a1a1a",
            }}>
              {/* Dynamic island bar */}
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px", background: "#111" }}>
                <div style={{ width: 120, height: 34, borderRadius: 20, background: "#000" }}/>
              </div>
              {/* App */}
              <iframe src="/" style={{ width: 390, height: 780, border: "none", display: "block" }} title="UniFi Home Prototype"/>
            </div>
            {/* Side buttons */}
            {[
              { side: "left", top: 110, h: 32 },
              { side: "left", top: 156, h: 60 },
              { side: "left", top: 230, h: 60 },
              { side: "right", top: 148, h: 76 },
            ].map((b, i) => (
              <div key={i} style={{
                position: "absolute", [b.side]: -4,
                top: b.top, width: 4, height: b.h,
                background: "#2a2a2a", borderRadius: b.side === "left" ? "3px 0 0 3px" : "0 3px 3px 0",
              }}/>
            ))}
          </div>
        </Fade>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px 0", textAlign: "center", borderTop: "1px solid #f0f0f0" }}>
        <p style={{ fontSize: 12, color: "#c0c4cb" }}>Kristofer Pallfy · UX Design Case Study · 2025</p>
      </footer>
    </div>
  );
}

// ── Reusable components ───────────────────────────────────────────────────────

function Fade({ children, delay = "", className = "" }: { children: React.ReactNode; delay?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className={`fade ${on ? "on" : ""} ${delay} ${className}`}>{children}</div>;
}

function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Positions as % of total width (from Figma: total line 86→1718px on 1920 canvas)
  // 07:57=0%, 08:00=13.7%, 1h22m start=17.6%, 1h22m end=56.6%, 09:22=58.2%, 09:23=73.1%, 09:24=85.2%
  const stops = [
    { pct: 0,    time: "07:57",           italic: false, label: "App opened",           highlight: false },
    { pct: 13.7, time: "08:00",           italic: false, label: "0 devices found",       highlight: false },
    { pct: 17.6, time: "1 hour 22 minutes", italic: true, label: "Troubleshooting, testing different ports etc. Called ISP (bridged a port).", note: "App guidance did not help", highlight: true },
    { pct: 58.2, time: "09:22",           italic: false, label: "Factory reset",         highlight: false },
    { pct: 73.1, time: "09:23",           italic: false, label: "Connected",             highlight: false },
    { pct: 85.2, time: "09:24",           italic: false, label: "Setup Complete!",       emoji: "🎉", highlight: false },
  ];

  // Red segment: from 08:00 (13.7%) to 09:22 (58.2%) — spans the 1h22m lost period
  const redStart = 13.7;
  const redEnd   = 58.2;

  return (
    <div ref={ref} style={{ position: "relative", paddingBottom: 80 }}>
      {/* ── Gray base line ── */}
      <div style={{
        position: "absolute", top: 36, left: 0, right: 0, height: 1,
        background: "#d1d5db",
        overflow: "hidden",
      }}>
        {/* Animated fill */}
        <div style={{
          height: "100%", background: "#d1d5db",
          width: visible ? "100%" : "0%",
          transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
        }}/>
      </div>

      {/* ── Red segment (draws in after gray line) ── */}
      <div style={{
        position: "absolute", top: 33, height: 3, borderRadius: 2,
        left: `${redStart}%`, width: visible ? `${redEnd - redStart}%` : "0%",
        background: "#ef4444",
        transformOrigin: "left center",
        transition: "width 0.9s cubic-bezier(0.4,0,0.2,1) 0.6s",
      }}/>

      {/* ── Stops ── */}
      {stops.map((s, i) => (
        <div key={i} style={{
          position: "absolute", left: `${s.pct}%`,
          display: "flex", flexDirection: "column", alignItems: "flex-start",
          opacity: visible ? 1 : 0,
          transition: `opacity 0.5s ease ${0.3 + i * 0.1}s`,
        }}>
          {/* Time label */}
          <p style={{
            fontSize: "clamp(12px, 1.4vw, 22px)",
            fontStyle: s.italic ? "italic" : "normal",
            color: s.highlight ? "#ef4444" : "#000",
            whiteSpace: "nowrap", marginBottom: 8, lineHeight: 1,
          }}>
            {s.time}{(s as {emoji?: string}).emoji ? ` ${(s as {emoji?: string}).emoji}` : ""}
          </p>
          {/* Dot on line */}
          <div style={{ width: 8, height: 8 }} />

          {/* Label below line */}
          <div style={{ marginTop: 12, maxWidth: i === 2 ? 240 : 160 }}>
            <p style={{ fontSize: "clamp(11px, 1.1vw, 18px)", color: "#000", lineHeight: 1.5 }}>{s.label}</p>
            {s.note && (
              <p style={{ fontSize: "clamp(10px, 1vw, 16px)", color: "#ef4444", fontWeight: 500, marginTop: 4 }}>{s.note}</p>
            )}
            {/* Dashed red box around the troubleshooting item */}
            {s.highlight && (
              <div style={{
                position: "absolute", top: 56,
                left: -8, right: -40,
                bottom: -12,
                border: "1px dashed #ef4444",
                borderRadius: 4,
                pointerEvents: "none",
              }}/>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0073f1" }}>{children}</p>;
}


function ConnectingIllustration() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative", width: 220, height: 220 }}>
        {/* Outer glow rings */}
        {[1, 0.5, 0.2].map((o, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            border: `1px solid rgba(0,115,241,${o * 0.15})`,
            inset: i * 18,
          }}/>
        ))}
        {/* Router */}
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          width: 80, height: 104, borderRadius: 22,
          background: "linear-gradient(160deg, #f8f9fb 0%, #e8ecf0 100%)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "#0073f1" }}/>
        </div>
        {/* Animated arc */}
        <svg style={{ position: "absolute", inset: 0 }} width="220" height="220" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r="90" fill="none" stroke="#dbeafe" strokeWidth="12"/>
          <circle cx="110" cy="110" r="90" fill="none" stroke="#0073f1" strokeWidth="12"
            strokeDasharray="502" strokeLinecap="round"
            style={{ transformOrigin: "110px 110px", transform: "rotate(-90deg)" }}
            className="arc-path"/>
        </svg>
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "#5f6369", letterSpacing: "0.02em" }}>Connecting...</p>
    </div>
  );
}

function AppAnnotation() {
  const annotations = [
    { x: "8%",  y: "12%", label: "Device name truncated",                    side: "left"  },
    { x: "8%",  y: "25%", label: "Technical jargon",                          side: "left"  },
    { x: "8%",  y: "38%", label: "No clear network status",                   side: "left"  },
    { x: "8%",  y: "58%", label: "Technical label",                           side: "left"  },
    { x: "92%", y: "22%", label: "Unlabeled icons",                           side: "right" },
    { x: "92%", y: "38%", label: "Static data prioritized over live perf.",   side: "right" },
    { x: "92%", y: "58%", label: "Real-time performance not primary signal",  side: "right" },
    { x: "92%", y: "74%", label: "Inconsistent behavior across shortcuts",    side: "right" },
  ];

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420, aspectRatio: "9/16" }}>
      {/* Phone mockup */}
      <div style={{
        position: "absolute", left: "20%", right: "20%", top: "5%", bottom: "5%",
        borderRadius: 24, background: "#f8fafc", border: "1px solid #e2e8f0",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}>
        {/* Status bar */}
        <div style={{ padding: "8px 14px 4px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#0b182c" }}>09:24</span>
          <div style={{ display: "flex", gap: 3 }}>
            {[1,1,1].map((_, i) => <div key={i} style={{ width: 3, height: 5+i*2, background: "#0b182c", borderRadius: 1 }}/>)}
          </div>
        </div>
        {/* App rows */}
        {[
          { label: "Dream Rou...", sub: "UniFi · UDR7" },
          { label: "Internet Activity", sub: "DL 854 MB  UL 262 MB" },
          { label: "ISP Health", sub: "Telenor Sverige · 24.216.33.4" },
          { label: "Live Throughput", sub: "1.11 Mbps ↑ 5.02 Mbit" },
          { label: "Shortcuts", sub: "ISP Speed  Topology  AR  Teleport" },
        ].map((row, i) => (
          <div key={i} style={{ padding: "7px 10px", borderBottom: "1px solid #f0f0f0", background: "#fff" }}>
            <p style={{ fontSize: 8, fontWeight: 600, color: "#0b182c" }}>{row.label}</p>
            <p style={{ fontSize: 7, color: "#9da1a7", marginTop: 2 }}>{row.sub}</p>
          </div>
        ))}
        {/* Nav bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "6px 0 10px", background: "rgba(255,255,255,0.9)", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-around" }}>
          {[0,1,2,3,4].map((i) => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: i === 0 ? "#0073f1" : "#e8eef8" }}/>
          ))}
        </div>
      </div>

      {/* Annotation lines + labels */}
      {annotations.map((a, i) => (
        <div key={i} style={{
          position: "absolute",
          top: a.y, [a.side === "left" ? "left" : "right"]: 0,
          display: "flex", alignItems: "center",
          gap: 6,
          flexDirection: a.side === "left" ? "row" : "row-reverse",
        }}>
          <span style={{
            fontSize: 9, fontWeight: 500, color: "#0b182c",
            background: a.side === "left" ? "#fff8f8" : "#f0f8ff",
            border: `1px solid ${a.side === "left" ? "#fecaca" : "#bfdbfe"}`,
            padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap",
          }}>{a.label}</span>
          <div style={{ width: 20, height: 1, background: a.side === "left" ? "#ef4444" : "#0073f1" }}/>
        </div>
      ))}
    </div>
  );
}
