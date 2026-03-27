"use client";
import { useState, useEffect, useRef } from "react";

// ── Network status type ───────────────────────────────────────────────────────
type NetworkStatus = "healthy" | "issues" | "offline";
const STATUS_CYCLE: NetworkStatus[] = ["healthy", "issues", "offline"];

// ── Chart constants ────────────────────────────────────────────────────────────
const NUM_PTS = 72;
const CL = 18, CR = 372, CT = 8, CB = 128;

function dlWave(t: number, status: NetworkStatus): number {
  if (status === "offline") return Math.max(0, 1.2 + 0.8 * Math.sin(t * 0.04));
  if (status === "issues") return Math.max(4, Math.min(42,
    20 + 9 * Math.sin(t * 0.055) + 5 * Math.sin(t * 0.14 + 1.1)
       + 6 * Math.sin(t * 0.22 + 0.9) + 2 * Math.sin(t * 0.67 + 0.7)
  ));
  return Math.max(10, Math.min(82,
    46 + 14 * Math.sin(t * 0.055) + 7 * Math.sin(t * 0.14 + 1.1)
       + 3.5 * Math.sin(t * 0.32 + 2.3) + 1.5 * Math.sin(t * 0.67 + 0.7)
  ));
}
function ulWave(t: number, status: NetworkStatus): number {
  if (status === "offline") return Math.max(0, 0.6 + 0.4 * Math.sin(t * 0.035 + 1));
  if (status === "issues") return Math.max(2, Math.min(16,
    8 + 3.5 * Math.sin(t * 0.075 + 2.5) + 2 * Math.sin(t * 0.24 + 1.2)
      + 2.5 * Math.sin(t * 0.19 + 0.3)
  ));
  return Math.max(5, Math.min(28,
    17 + 5 * Math.sin(t * 0.075 + 2.5) + 2.5 * Math.sin(t * 0.24 + 1.2)
       + 1.2 * Math.sin(t * 0.55 + 0.4)
  ));
}
function smoothPath(pts: number[], fill?: boolean): string {
  const W = CR - CL, H = CB - CT, step = W / (pts.length - 1);
  const x = (i: number) => CL + i * step;
  const y = (v: number) => CB - (v / 100) * H;
  let d = `M${x(0)},${y(pts[0])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const mx = (x(i) + x(i + 1)) / 2;
    d += ` C${mx},${y(pts[i])} ${mx},${y(pts[i + 1])} ${x(i + 1)},${y(pts[i + 1])}`;
  }
  if (fill) d += ` L${x(pts.length - 1)},${CB} L${x(0)},${CB} Z`;
  return d;
}
function fmtKb(raw: number, status: NetworkStatus = "healthy"): string {
  if (status === "offline") return "0 kb";
  const mult = status === "issues" ? 5 : 15;
  const base = status === "issues" ? 18 : 120;
  const kb = Math.round(raw * mult + base);
  return kb >= 1000 ? `${(kb / 1000).toFixed(1)} Mb` : `${kb} kb`;
}
function fmtTot(raw: number, status: NetworkStatus = "healthy"): string {
  if (status === "offline") return "0 MB";
  const mb = status === "issues"
    ? (raw * 0.04 + 0.2).toFixed(1)
    : (raw * 0.15 + 1.0).toFixed(1);
  return `${mb} MB`;
}

// ── Animated chart hook ───────────────────────────────────────────────────────
function useWaves(status: NetworkStatus) {
  const [dl, setDl] = useState<number[]>([]);
  const [ul, setUl] = useState<number[]>([]);
  const [dlVal, setDlVal] = useState(50);
  const [ulVal, setUlVal] = useState(20);
  const tick    = useRef(0);
  const raf     = useRef(0);
  const last    = useRef(0);
  const statRef = useRef<NetworkStatus>(status);

  useEffect(() => { statRef.current = status; }, [status]);

  useEffect(() => {
    const init = Array.from({ length: NUM_PTS }, (_, i) => i);
    setDl(init.map(i => dlWave(i, "healthy")));
    setUl(init.map(i => ulWave(i, "healthy")));
    tick.current = NUM_PTS;

    const loop = (ts: number) => {
      if (ts - last.current > 380) {
        last.current = ts;
        const t = tick.current++;
        const nd = dlWave(t, statRef.current);
        const nu = ulWave(t, statRef.current);
        setDl(p => [...p.slice(1), nd]);
        setUl(p => [...p.slice(1), nu]);
        setDlVal(nd);
        setUlVal(nu);
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return { dl, ul, dlVal, ulVal };
}

// ── Icon components ───────────────────────────────────────────────────────────
const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0073f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const ChevronDown = ({ rotated }: { rotated?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: "transform 0.3s", transform: rotated ? "rotate(180deg)" : "rotate(0deg)" }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
// Tab bar icons — exact SVG paths from UniFi icon set
const HomeIcon = ({ color = "#1c1c1e" }: { color?: string }) => (
  <svg width="28" height="28" viewBox="0 0 37.43 37.43" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M37.43 18.72C37.43 29.06 29.05 37.44 18.71 37.44C8.37 37.44 0 29.05 0 18.72C0 8.39 8.38 0 18.72 0C29.06 0 37.44 8.38 37.44 18.72H37.43Z" fill={color}/>
    <path d="M23 25C23 22.7909 21.2091 21 19 21C16.7909 21 15 22.7909 15 25C15 27.2091 16.7909 29 19 29V31C15.6863 31 13 28.3137 13 25C13 21.6863 15.6863 19 19 19C22.3137 19 25 21.6863 25 25C25 28.3137 22.3137 31 19 31V29C21.2091 29 23 27.2091 23 25Z" fill="#F9F9F9"/>
    <path d="M8.38175 15.5315C8.24425 16.0663 7.69906 16.3883 7.16424 16.251C6.62936 16.1134 6.30722 15.5683 6.44474 15.0335C7.1587 12.2564 8.77606 9.79587 11.0421 8.03895C13.3081 6.28205 16.0941 5.32848 18.9615 5.32882C21.8287 5.3292 24.6149 6.28292 26.8804 8.04033C29.146 9.79777 30.7622 12.2595 31.4755 15.0367C31.6126 15.5714 31.2909 16.1158 30.7563 16.2533C30.2214 16.3907 29.6761 16.0688 29.5387 15.534C28.9358 13.1866 27.5693 11.1062 25.6544 9.62075C23.7394 8.1353 21.384 7.32934 18.9604 7.32906C16.5371 7.3289 14.1824 8.13448 12.2672 9.61937C10.352 11.1044 8.9852 13.1843 8.38175 15.5315Z" fill="white"/>
    <path d="M12.959 15.2512C12.6191 14.8161 11.9907 14.7384 11.5554 15.0781C11.1201 15.4178 11.0428 16.0463 11.3823 16.4817L15.2896 21.4881L16.8662 20.2576L12.959 15.2512Z" fill="white"/>
  </svg>
);
const DevicesIcon = ({ color = "#1c1c1e" }: { color?: string }) => (
  <svg width="28" height="28" viewBox="0 0 37.43 37.43" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M37.43 18.72C37.43 29.06 29.05 37.44 18.71 37.44C8.37 37.44 0 29.05 0 18.72C0 8.39 8.38 0 18.72 0C29.06 0 37.44 8.38 37.44 18.72H37.43ZM26.15 18.71C26.15 14.61 22.83 11.29 18.73 11.29C14.63 11.29 11.31 14.61 11.31 18.71C11.31 22.81 14.63 26.13 18.73 26.13C22.83 26.13 26.15 22.81 26.15 18.71Z" fill={color}/>
    <path d="M18.7099 24.3399C21.8027 24.3399 24.3099 21.8327 24.3099 18.7399C24.3099 15.6471 21.8027 13.1399 18.7099 13.1399C15.6171 13.1399 13.1099 15.6471 13.1099 18.7399C13.1099 21.8327 15.6171 24.3399 18.7099 24.3399Z" fill={color}/>
  </svg>
);
const WifiTabIcon = ({ color = "#1c1c1e" }: { color?: string }) => (
  <svg width="28" height="24" viewBox="0 0 37.15 30.1" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.8298 13.24L18.0498 13.47C17.2598 13.7 16.7098 14.41 16.6798 15.23L16.4798 20.57C16.4398 21.59 15.5998 22.4 14.5798 22.41L3.50977 22.49C2.55977 22.49 1.50977 21.33 1.50977 20.35V2.24C1.50977 0.87 2.62977 0 4.10977 0L33.1698 0.05C33.9298 0.05 34.6498 0.48 34.9198 1.19C35.2398 2.03 35.3098 3.04 35.2198 4.01C35.1298 4.98 34.3098 5.7 33.3398 5.71L22.3498 5.85C21.3898 5.86 20.5898 6.58 20.4698 7.53C20.3098 8.82 20.2398 9.97 20.1898 11.48C20.1598 12.3 19.6098 13.01 18.8198 13.24H18.8298Z" fill={color}/>
    <path d="M31.8299 29.27C30.8199 26.39 32.3099 15.18 30.8699 13.82C29.4299 12.46 26.9299 13.94 23.1099 12.85C21.5499 12.41 21.5899 8.08 23.1199 7.86C27.0199 7.31 30.6899 7.55 34.6999 7.5C35.9599 7.48 37.1699 8.58 37.1599 9.9L37.0299 28.63C37.0199 30.37 32.5099 30.55 31.8299 29.27Z" fill={color}/>
    <path d="M29.6798 27.61C29.6798 29.15 28.5298 30.07 27.2098 30.03L19.7498 29.83C19.0398 29.81 18.4698 29.23 18.4498 28.52L18.2498 17.19C18.2298 16.08 19.4298 15.02 20.4698 15.02H27.7998C28.5998 15.02 29.6798 16.4 29.6798 17.24V27.62V27.61Z" fill={color}/>
    <path d="M16.4599 27.06C16.4899 28.62 15.2399 29.91 13.6699 29.92L5.51994 29.98C1.45994 30.01 -0.540055 26.55 0.109945 25.16C0.289945 24.78 1.23994 24.27 1.67994 24.27L13.6499 24.3C15.1799 24.3 16.4199 25.53 16.4499 27.05L16.4599 27.06Z" fill={color}/>
  </svg>
);
const BellIcon = ({ color = "#1c1c1e" }: { color?: string }) => (
  <svg width="22" height="28" viewBox="0 0 31.78 35.65" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24.47 31.77H7.31003L5.97003 28.44C-1.12997 22.71 -1.99997 12.12 3.91003 5.42995C10.12 -1.61005 20.84 -1.82005 27.33 4.89995C33.7 11.5 33.27 22.23 25.92 28.28L24.48 31.78L24.47 31.77ZM14.43 7.63995C14.77 7.53995 15.5 7.11995 15.78 6.93995C15.99 6.80995 15.54 6.07995 15.3 6.00995C11.5 4.94995 3.74003 11.37 6.11003 17.7C9.25003 16.17 5.43003 10.39 14.43 7.63995Z" fill={color}/>
    <path d="M20.33 35.6499H11.58C11.26 35.6499 10.49 35.0099 10.3 34.8299C10.03 34.5899 11.13 33.6499 11.53 33.6499H20.19C20.49 33.6499 21.24 34.2299 21.48 34.3799C21.72 34.5299 20.72 35.6499 20.33 35.6499Z" fill={color}/>
  </svg>
);
const GearIcon = ({ color = "#1c1c1e" }: { color?: string }) => (
  <svg width="28" height="28" viewBox="0 0 37.62 37.69" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30.8102 33.36C28.3402 35.83 27.0102 31.57 24.6402 32.41C22.2702 33.25 23.5202 36.72 21.8702 37.22C20.3602 37.68 14.9502 38.52 14.6902 35.55C14.5902 34.4 14.3102 33.01 13.5002 32.64C10.6402 31.34 9.33017 35.46 7.53017 33.8L4.59017 31.09C1.68017 28.42 6.12017 26.86 5.20017 24.77C4.82017 23.9 3.56017 23.03 2.77017 23.01C0.290167 22.93 -0.119833 21.12 0.0301667 19.05L0.240167 16.11C0.370167 14.34 3.72017 15.3 5.03017 13.26C6.34017 11.22 2.99017 9.58004 3.63017 8.00004C3.92017 7.28004 4.91017 6.18004 5.59017 5.57004L7.70017 3.69004C9.04017 2.50004 11.1002 5.91004 13.0102 5.14004C14.1302 4.69004 14.6102 3.38004 14.7002 2.14004C14.9302 -0.809961 20.3902 3.93689e-05 21.9002 0.460039C23.5702 0.980039 22.0102 3.87004 24.7702 5.15004C26.5402 5.97004 28.6802 2.28004 30.2202 3.81004L33.8802 7.45004C35.4202 8.98004 31.6702 10.92 32.5002 13.02C33.5702 15.7 37.6102 13.54 37.6102 16.99V20.69C37.6102 24.12 33.4902 22.01 32.4802 24.64C31.5502 27.06 35.8502 28.34 33.4102 30.76L30.8002 33.36H30.8102ZM25.2802 18.81C25.2802 15.24 22.3902 12.35 18.8202 12.35C15.2502 12.35 12.3602 15.24 12.3602 18.81C12.3602 22.38 15.2502 25.27 18.8202 25.27C22.3902 25.27 25.2802 22.38 25.2802 18.81Z" fill={color}/>
  </svg>
);
const NetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="14" width="5" height="7" rx="1"/><rect x="9.5" y="9" width="5" height="12" rx="1"/><rect x="17" y="4" width="5" height="17" rx="1"/>
  </svg>
);
const WarnIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" stroke="#f59e0b"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="#f59e0b"/>
    <circle cx="12" cy="16" r="0.8" fill="#f59e0b" stroke="none"/>
  </svg>
);
const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" stroke="#ef4444"/>
    <line x1="12" y1="8" x2="12" y2="13" stroke="#ef4444"/>
    <circle cx="12" cy="16.5" r="0.8" fill="#ef4444" stroke="none"/>
  </svg>
);
const SpeedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l4.5-4.5"/><circle cx="12" cy="12" r="1" fill="#6b7280"/>
  </svg>
);
const TopoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const BoxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

// ── Pulse dot ─────────────────────────────────────────────────────────────────
const PulseDot = ({ color = "#22c55e" }: { color?: string }) => (
  <div className="relative flex items-center justify-center w-4 h-4" style={{ zIndex: 1 }}>
    <div className="absolute w-4 h-4 rounded-full opacity-20 animate-ping"
      style={{ animationDuration: "2.8s", background: color, zIndex: 1 }} />
    <div className="w-2 h-2 rounded-full" style={{ background: color, position: "relative", zIndex: 1 }} />
  </div>
);

// ── Shortcut button gradient ──────────────────────────────────────────────────
const shortcutBtnStyle: React.CSSProperties = {
  border: "1px solid #E7E7E7",
  background: "linear-gradient(180deg, #f6f6f7 0%, #ffffff 100%)",
  borderRadius: 16,
};

// ── Device frame wrapper (desktop only) ───────────────────────────────────────
function DeviceFrame({ children, isMobile }: { children: React.ReactNode; isMobile: boolean }) {
  if (isMobile) return <>{children}</>;
  return (
    <div className="relative" style={{ width: 390 }}>
      {/* Side buttons – silent switch */}
      <div className="absolute" style={{ left: -5, top: 108, width: 5, height: 22, background: "linear-gradient(to left, #c0c0c5, #d8d8dc, #b8b8bd)", borderRadius: "3px 0 0 3px", boxShadow: "-2px 0 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)" }}/>
      <div className="absolute" style={{ left: -5, top: 140, width: 5, height: 36, background: "linear-gradient(to left, #c0c0c5, #d8d8dc, #b8b8bd)", borderRadius: "3px 0 0 3px", boxShadow: "-2px 0 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)" }}/>
      <div className="absolute" style={{ left: -5, top: 184, width: 5, height: 36, background: "linear-gradient(to left, #c0c0c5, #d8d8dc, #b8b8bd)", borderRadius: "3px 0 0 3px", boxShadow: "-2px 0 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)" }}/>
      <div className="absolute" style={{ right: -5, top: 158, width: 5, height: 64, background: "linear-gradient(to right, #c0c0c5, #d8d8dc, #b8b8bd)", borderRadius: "0 3px 3px 0", boxShadow: "2px 0 4px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)" }}/>
      {/* Metallic ring */}
      <div style={{ borderRadius: 54, padding: 4, background: "linear-gradient(145deg, #e8e8ec 0%, #c8c8ce 30%, #dadadf 50%, #c4c4ca 70%, #e0e0e5 100%)", boxShadow: ["0 0 0 1px rgba(255,255,255,0.5) inset", "0 0 0 1px rgba(0,0,0,0.18)", "0 32px 80px rgba(0,0,0,0.28)", "0 8px 24px rgba(0,0,0,0.14)"].join(", ") }}>
        {children}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [qualityOpen, setQualityOpen] = useState(true);
  const [activityOpen, setActivityOpen] = useState(true);
  const [netStatus, setNetStatus] = useState<NetworkStatus>("healthy");
  const [isMobile, setIsMobile] = useState(false);
  const { dl, ul, dlVal, ulVal } = useWaves(netStatus);

  // Cycle through statuses every 10 seconds
  useEffect(() => {
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % STATUS_CYCLE.length;
      setNetStatus(STATUS_CYCLE[idx]);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const check = () => {
      const ua = navigator.userAgent;
      const isTouchDevice = /iPhone|iPad|iPod|Android/i.test(ua);
      const isNarrow = window.innerWidth <= 500;
      setIsMobile(isTouchDevice || isNarrow);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Per-state UI config ──────────────────────────────────────────────────
  const stateConfig = {
    healthy: {
      banner: { bg: "#ecfff3", border: "#d1f5e0", Icon: NetIcon, title: "Your network is running smoothly", sub: "3 devices connected · 1.1 Mbps download" },
      internet: { label: "Online",  color: "#22c55e", sub: "Telenor" },
      wifi:     { label: "Active",  color: "#22c55e", sub: "UniFi" },
      devices:  { count: 3, sub: "Connected", warn: false },
      qualityBar: [
        { w: "52%", bg: "#22c55e" }, { w: "16%", bg: "#ef4444" },
        { w: "7%",  bg: "#fb923c" }, { w: "1",   bg: "#22c55e" },
        { w: "2%",  bg: "#ef4444" }, { w: "1",   bg: "#22c55e" },
      ],
      qualityDot: "#22c55e",
    },
    issues: {
      banner: { bg: "#fff8ec", border: "#fde8c0", Icon: WarnIcon, title: "Minor issues detected", sub: "1 device offline · Degraded throughput" },
      internet: { label: "Online",  color: "#22c55e", sub: "Telenor" },
      wifi:     { label: "Limited", color: "#f59e0b", sub: "UniFi" },
      devices:  { count: 2, sub: "1 offline", warn: true },
      qualityBar: [
        { w: "22%", bg: "#22c55e" }, { w: "28%", bg: "#ef4444" },
        { w: "12%", bg: "#fb923c" }, { w: "1",   bg: "#22c55e" },
        { w: "15%", bg: "#ef4444" }, { w: "1",   bg: "#fb923c" },
      ],
      qualityDot: "#f59e0b",
    },
    offline: {
      banner: { bg: "#fff1f0", border: "#ffd4d0", Icon: ErrorIcon, title: "Internet connection lost", sub: "No connectivity detected" },
      internet: { label: "Offline",    color: "#ef4444", sub: "Telenor" },
      wifi:     { label: "No internet", color: "#f59e0b", sub: "UniFi" },
      devices:  { count: 3, sub: "No internet", warn: false },
      qualityBar: [
        { w: "100%", bg: "#d1d5db" },
      ],
      qualityDot: "#ef4444",
    },
  } satisfies Record<NetworkStatus, {
    banner: { bg: string; border: string; Icon: React.ComponentType; title: string; sub: string };
    internet: { label: string; color: string; sub: string };
    wifi: { label: string; color: string; sub: string };
    devices: { count: number; sub: string; warn: boolean };
    qualityBar: { w: string; bg: string }[];
    qualityDot: string;
  }>;
  const cfg = stateConfig[netStatus];

  const tabs = [
    { id: "home",     label: "Status",   Icon: HomeIcon },
    { id: "devices",  label: "Network",  Icon: DevicesIcon },
    { id: "wifi",     label: "Devices",  Icon: WifiTabIcon },
    { id: "alerts",   label: "Insights", Icon: BellIcon },
    { id: "settings", label: "Settings", Icon: GearIcon },
  ];

  return (
    <div className={isMobile ? "w-screen h-screen bg-white overflow-hidden" : "flex min-h-screen items-center justify-center bg-white"}>

      <DeviceFrame isMobile={isMobile}>

          {/* ── Screen glass ───────────────────────────────────────────────── */}
          <div className="relative flex flex-col" style={isMobile ? {
            width: "100vw", height: "100dvh", overflow: "hidden", background: "#ffffff",
          } : {
            borderRadius: 50, overflow: "hidden", height: 844, background: "#ffffff",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
          }}>

            {/* Subtle screen glare at top */}
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
              height: 200,
              background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
              borderRadius: "50px 50px 0 0",
              zIndex: 10,
            }}/>

            {/* iOS Status bar – hidden on real mobile (use device's own status bar) */}
            {!isMobile && <div className="flex items-center justify-between px-7 pt-4 pb-1 shrink-0 relative" style={{ zIndex: 5, background: "#ffffff" }}>
              <span className="text-[15px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>9:41</span>
              {/* Dynamic Island */}
              <div className="absolute left-1/2 -translate-x-1/2" style={{
                top: 12, width: 120, height: 36,
                background: "#000",
                borderRadius: 20,
              }}/>
              <div className="flex items-center gap-1.5">
                {/* Signal bars */}
                <svg width="17" height="12" viewBox="0 0 17 12" fill="#0b182c">
                  <rect x="0" y="5" width="3" height="7" rx="0.8"/>
                  <rect x="4.5" y="3" width="3" height="9" rx="0.8"/>
                  <rect x="9" y="1" width="3" height="11" rx="0.8"/>
                  <rect x="13.5" y="0" width="3" height="12" rx="0.8"/>
                </svg>
                {/* WiFi */}
                <svg width="16" height="12" viewBox="0 0 24 18" fill="#0b182c">
                  <path d="M12 5C7 5 2.5 7.5 0 11.5l2.5 2.5C4.5 10.5 8 8.5 12 8.5s7.5 2 9.5 5.5L24 11.5C21.5 7.5 17 5 12 5z" opacity="0.4"/>
                  <path d="M12 10c-3 0-5.5 1.5-7 3.5l2.5 2.5c1-1.5 2.5-2.5 4.5-2.5s3.5 1 4.5 2.5l2.5-2.5c-1.5-2-4-3.5-7-3.5z"/>
                  <circle cx="12" cy="17" r="2"/>
                </svg>
                {/* Battery */}
                <svg width="26" height="13" viewBox="0 0 26 13" fill="none">
                  <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="#0b182c" strokeOpacity="0.35"/>
                  <rect x="2" y="2" width="17" height="9" rx="2" fill="#0b182c"/>
                  <path d="M24 4.5v4a2 2 0 0 0 0-4z" fill="#0b182c" fillOpacity="0.4"/>
                </svg>
              </div>
            </div>}

            {/* ── Top pill buttons — absolute, no scroll on touch ───────────── */}
            <div className="absolute left-0 right-0 px-4 z-20" style={{
              top: isMobile ? "calc(env(safe-area-inset-top, 0px) + 16px)" : 60,
              touchAction: "none",
            }}>
              <div className="flex gap-3 items-center">
                <button className="flex items-center gap-2.5 px-4 h-12 rounded-full flex-1" style={{
                  background: "rgba(249,249,249,0.95)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}>
                  <GlobeIcon />
                  <span className="flex-1 text-left text-[17px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Dream Router 7</span>
                  <span className="text-[#9da1a7]"><ChevronDown /></span>
                </button>
                <button className="flex items-center gap-3 px-4 h-12 rounded-full" style={{
                  background: "rgba(249,249,249,0.95)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}>
                  <MenuIcon />
                  <div className="w-7 h-7 rounded-full border-2 border-[#0073f1] overflow-hidden flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#60a5fa,#818cf8)" }}>
                    <span className="text-white text-[11px] font-bold" style={{ fontFamily: "'Google Sans', sans-serif" }}>KP</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Scrollable content — full height, only this area scrolls */}
            <div className="absolute inset-0 overflow-y-auto" style={{ paddingBottom: 110, background: "#ffffff" }}>
              <div className="px-4 pb-4 flex flex-col gap-4" style={{
                paddingTop: isMobile ? "calc(env(safe-area-inset-top, 0px) + 88px)" : 140,
              }}>

                {/* ── Network status banner ────────────────────────────────── */}
                <div className="rounded-2xl p-4 flex gap-3 items-start"
                  style={{ background: cfg.banner.bg, border: `1px solid ${cfg.banner.border}`, transition: "background 0.6s, border-color 0.6s" }}>
                  <div className="shrink-0 mt-0.5"><cfg.banner.Icon /></div>
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{cfg.banner.title}</p>
                    <div className="h-px my-2" style={{ background: cfg.banner.border }} />
                    <p className="text-[13px] text-[#5f6369]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{cfg.banner.sub}</p>
                  </div>
                </div>

                {/* ── Status tiles ─────────────────────────────────────────── */}
                <div className="flex gap-2">
                  {/* Internet */}
                  <div className="flex-1 rounded-2xl p-3 flex flex-col justify-between" style={{ border: "1px solid #E7E7E7", height: 110 }}>
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Internet</p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8c8cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PulseDot color={cfg.internet.color} />
                      <span className="text-[13px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{cfg.internet.label}</span>
                    </div>
                    <p className="text-[11px] text-[#9da1a7]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{cfg.internet.sub}</p>
                  </div>
                  {/* WiFi */}
                  <div className="flex-1 rounded-2xl p-3 flex flex-col justify-between" style={{ border: "1px solid #E7E7E7", height: 110 }}>
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>WiFi</p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8c8cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PulseDot color={cfg.wifi.color} />
                      <span className="text-[13px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{cfg.wifi.label}</span>
                    </div>
                    <p className="text-[11px] text-[#9da1a7]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{cfg.wifi.sub}</p>
                  </div>
                  {/* Devices */}
                  <div className="flex-1 rounded-2xl p-3 flex flex-col justify-between" style={{ border: "1px solid #E7E7E7", height: 110 }}>
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Devices</p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8c8cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <svg width="18" height="2" viewBox="0 0 18 2">
                        <line x1="0" y1="1" x2="18" y2="1" stroke="#c8c8cc" strokeWidth="1.5" strokeDasharray="2.5,2.5"/>
                      </svg>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: cfg.devices.warn ? "#fb923c" : "#0073f1" }}>
                        <span className="text-white text-[13px] font-semibold" style={{ fontFamily: "'Google Sans', sans-serif" }}>{cfg.devices.count}</span>
                      </div>
                      <svg width="18" height="2" viewBox="0 0 18 2">
                        <line x1="0" y1="1" x2="18" y2="1" stroke="#c8c8cc" strokeWidth="1.5" strokeDasharray="2.5,2.5"/>
                      </svg>
                    </div>
                    <p className="text-[11px] text-[#9da1a7]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{cfg.devices.sub}</p>
                  </div>
                </div>

                {/* ── Connection quality card (collapsible) ────────────────── */}
                <div className="rounded-2xl flex flex-col gap-3" style={{ border: "1px solid #E7E7E7", overflow: "hidden" }}>
                  <button className="flex items-center justify-between w-full px-4 pt-4"
                    onClick={() => setQualityOpen(o => !o)}>
                    <p className="text-[14px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Connection quality</p>
                    <span className="text-[#9da1a7]"><ChevronDown rotated={qualityOpen} /></span>
                  </button>

                  {qualityOpen ? (
                    <div className="flex flex-col gap-3 px-4 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#9da1a7]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Telenor Sverige</span>
                        <span className="text-[14px] text-[#9da1a7]" style={{ fontFamily: "'Google Sans', sans-serif" }}>23.234.12.1</span>
                      </div>
                      <div className="rounded-full overflow-hidden flex" style={{ height: 8, border: "1px solid #E7E7E7" }}>
                        {cfg.qualityBar.map((seg, i) => (
                          <div key={i} style={{ width: seg.w === "1" ? undefined : seg.w, flex: seg.w === "1" ? 1 : undefined, background: seg.bg, transition: "background 0.6s" }}/>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-[#9da1a7]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Live Throughput</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#0fc7f3]"/>
                            <span className="text-[13px]" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                              <span className="text-[#0fc7f3]">DL</span>
                              <span className="text-[#9da1a7] inline-block text-right" style={{ minWidth: 52, fontVariantNumeric: "tabular-nums" }}>{fmtKb(dlVal, netStatus)}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#8979ff]"/>
                            <span className="text-[13px]" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                              <span className="text-[#8979ff]">UL</span>
                              <span className="text-[#9da1a7] inline-block text-right" style={{ minWidth: 52, fontVariantNumeric: "tabular-nums" }}>{fmtKb(ulVal, netStatus)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button className="text-[13px] font-semibold text-[#0073f1]" style={{ fontFamily: "'Google Sans', sans-serif" }}>See all</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-4 pb-4">
                      <span className="text-[13px] text-[#9da1a7]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Telenor Sverige · 23.234.12.1</span>
                      <div className="w-2 h-2 rounded-full" style={{ background: cfg.qualityDot }}/>
                    </div>
                  )}
                </div>

                {/* ── Internet activity card (collapsible, animated) ────────── */}
                <div className="rounded-2xl flex flex-col gap-3" style={{ border: "1px solid #E7E7E7", overflow: "hidden" }}>
                  <button className="flex items-center justify-between w-full px-4 pt-4"
                    onClick={() => setActivityOpen(o => !o)}>
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Internet activity</span>
                      <span className="text-[14px] text-[#5f6369]" style={{ fontFamily: "'Google Sans', sans-serif" }}> 24h</span>
                    </div>
                    <span className="text-[#9da1a7]"><ChevronDown rotated={activityOpen} /></span>
                  </button>

                  {activityOpen ? (
                    <>
                      <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#0fc7f3]"/>
                            <span className="text-[13px]" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                              <span className="text-[#0fc7f3]">DL</span>
                              <span className="text-[#9da1a7] inline-block text-right" style={{ minWidth: 52, fontVariantNumeric: "tabular-nums" }}>{fmtKb(dlVal, netStatus)}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#8979ff]"/>
                            <span className="text-[13px]" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                              <span className="text-[#8979ff]">UL</span>
                              <span className="text-[#9da1a7] inline-block text-right" style={{ minWidth: 52, fontVariantNumeric: "tabular-nums" }}>{fmtKb(ulVal, netStatus)}</span>
                            </span>
                          </div>
                        </div>
                        <span className="text-[13px] text-[#9da1a7]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{fmtTot(dlVal, netStatus)}</span>
                      </div>

                      {/* Animated SVG chart — full card width, 16px inset each side */}
                      {dl.length > 1 && (
                        <svg width="100%" height="158" viewBox="0 0 390 158" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0fc7f3" stopOpacity="0.28"/>
                              <stop offset="100%" stopColor="#0fc7f3" stopOpacity="0.02"/>
                            </linearGradient>
                            <linearGradient id="ulGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8979ff" stopOpacity="0.22"/>
                              <stop offset="100%" stopColor="#8979ff" stopOpacity="0.02"/>
                            </linearGradient>
                            <clipPath id="chartClip">
                              <rect x={CL} y={CT} width={CR - CL} height={CB - CT + 2}/>
                            </clipPath>
                          </defs>
                          {/* Horizontal grid */}
                          {[CT, CT + (CB-CT)*0.33, CT + (CB-CT)*0.66, CB].map((yy, i) => (
                            <line key={i} x1={CL} y1={yy} x2={CR} y2={yy} stroke="#E7E7E7" strokeWidth="1"/>
                          ))}
                          {/* Vertical grid */}
                          {[0,1,2,3,4].map(i => (
                            <line key={i} x1={CL + i*(CR-CL)/4} y1={CT} x2={CL + i*(CR-CL)/4} y2={CB} stroke="#E7E7E7" strokeWidth="1" strokeDasharray="3,3"/>
                          ))}
                          {/* DL */}
                          <path d={smoothPath(dl, true)} fill="url(#dlGrad)" clipPath="url(#chartClip)"/>
                          <path d={smoothPath(dl)} fill="none" stroke="#0fc7f3" strokeWidth="2" strokeLinecap="round" clipPath="url(#chartClip)"/>
                          {/* UL */}
                          <path d={smoothPath(ul, true)} fill="url(#ulGrad)" clipPath="url(#chartClip)"/>
                          <path d={smoothPath(ul)} fill="none" stroke="#8979ff" strokeWidth="2" strokeLinecap="round" clipPath="url(#chartClip)"/>
                          {/* Y labels — overlaid inside chart left edge */}
                          <text x={CL + 4} y={CT + 10} textAnchor="start" fontSize="10" fill="#b8bcc2" fontFamily="Google Sans, sans-serif">kbps</text>
                          <text x={CL + 4} y={CT + (CB-CT)*0.33 + 4} textAnchor="start" fontSize="10" fill="#b8bcc2" fontFamily="Google Sans, sans-serif">20</text>
                          <text x={CL + 4} y={CT + (CB-CT)*0.66 + 4} textAnchor="start" fontSize="10" fill="#b8bcc2" fontFamily="Google Sans, sans-serif">10</text>
                          <text x={CL + 4} y={CB - 3} textAnchor="start" fontSize="10" fill="#b8bcc2" fontFamily="Google Sans, sans-serif">0</text>
                          {/* X labels */}
                          {["10:00","16:00","22:00","4:00","Now"].map((lbl, i) => (
                            <text key={i} x={CL + i*(CR-CL)/4} y={CB + 14} textAnchor="middle" fontSize="10" fill="#9da1a7" fontFamily="Google Sans, sans-serif">{lbl}</text>
                          ))}
                        </svg>
                      )}

                      <div className="flex justify-end px-4 pb-4">
                        <button className="text-[13px] font-semibold text-[#0073f1]" style={{ fontFamily: "'Google Sans', sans-serif" }}>See all</button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 px-4 pb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#0fc7f3]"/>
                        <span className="text-[13px]" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                          <span className="text-[#0fc7f3]">DL</span>
                          <span className="text-[#9da1a7]"> {fmtKb(dlVal, netStatus)}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#8979ff]"/>
                        <span className="text-[13px]" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                          <span className="text-[#8979ff]">UL</span>
                          <span className="text-[#9da1a7]"> {fmtKb(ulVal, netStatus)}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Shortcuts ────────────────────────────────────────────── */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Shortcuts</p>
                    <button className="text-[14px] font-semibold text-[#0073f1]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Add +</button>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { icon: <SpeedIcon />, label: "ISP Speed" },
                      { icon: <TopoIcon />, label: "Topology" },
                      { icon: <BoxIcon />, label: "AR" },
                    ].map(item => (
                      <button key={item.label} className="flex-1 p-2 flex flex-col items-center gap-1.5" style={shortcutBtnStyle}>
                        {item.icon}
                        <span className="text-[12px] text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Applications ─────────────────────────────────────────── */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center h-5">
                    <div className="pr-2" style={{ borderRight: "1px solid #d6d8db" }}>
                      <p className="text-[14px] font-semibold text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Applications</p>
                    </div>
                    <div className="flex-1 px-2">
                      <span className="text-[13px] text-[#9da1a7]" style={{ fontFamily: "'Google Sans', sans-serif" }}>External</span>
                    </div>
                    <button className="text-[13px] font-semibold text-[#0073f1]" style={{ fontFamily: "'Google Sans', sans-serif" }}>Show more</button>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { icon: <BoxIcon />, label: "AR", sub: "Opens WiFiMan" },
                      { icon: <TopoIcon />, label: "Topology", sub: "Opens WiFiMan" },
                    ].map(item => (
                      <button key={item.label} className="flex-1 p-2 flex flex-col items-center gap-1.5" style={shortcutBtnStyle}>
                        {item.icon}
                        <span className="text-[12px] text-[#0b182c]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{item.label}</span>
                        <span className="text-[11px] text-[#5f6369]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{item.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Floating glass tab bar ───────────────────────────────────── */}
            <div className="absolute left-0 right-0 px-7" style={{
              bottom: isMobile ? "max(24px, env(safe-area-inset-bottom, 24px))" : 20,
              touchAction: "none",
            }}>
              <div className="flex items-center justify-around relative"
                style={{
                  height: 72,
                  background: "rgba(255,255,255,0.82)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  borderRadius: 36,
                  border: "1px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}>
                {tabs.map(({ id, label, Icon }) => {
                  const active = activeTab === id;
                  const isHome = id === "home";
                  return (
                    <button key={id} className="flex items-center justify-center flex-1" onClick={() => setActiveTab(id)}
                      aria-label={label}>
                      <div className="flex flex-col items-center justify-center gap-1.5"
                        style={{
                          width: 56, height: 56,
                          borderRadius: 28,
                          background: active ? "rgba(0,0,0,0.07)" : "transparent",
                          transition: "background 0.2s",
                        }}>
                        <Icon color={active ? "#0066FC" : "#8E8E93"} />
                        <span style={{
                          fontSize: 9,
                          fontWeight: active ? 600 : 400,
                          color: active ? "#0066FC" : "#8E8E93",
                          letterSpacing: 0.1,
                          fontFamily: "Google Sans, sans-serif",
                          lineHeight: 1,
                        }}>{label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>{/* /screen */}

      </DeviceFrame>

    </div>
  );
}
