"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Users, MessagesSquare, Bot, ClipboardList, Settings2, ShoppingBag, ChevronDown, Bold, Italic, Underline, List, ListOrdered, Link, Wifi, Signal, Battery } from "lucide-react";

// ── Icons ──────────────────────────────────────────────────────────────────────

const AvyLogo = () => (
  <img src="/avy_logo.png" alt="avy" style={{ height: 32, width: "auto", display: "block" }} />
);

const AvyLogoDark = () => (
  <img src="/avy_logo.png" alt="avy" style={{ height: 22, width: 59, objectFit: "contain", objectPosition: "left", display: "block", filter: "invert(1)" }} />
);

const StockholmshemLogo = ({ height = 28, inverted = false }: { height?: number; inverted?: boolean }) => (
  <img src="/stockholmshem_logo.svg" alt="Stockholmshem" style={{ height, width: "auto", display: "block", filter: inverted ? "brightness(0) invert(1)" : "none" }} />
);

const BalderLogo = ({ height = 28, inverted = false }: { height?: number; inverted?: boolean }) => (
  <img src="/balder1.png" alt="Balder" style={{ height, width: "auto", display: "block", filter: inverted ? "brightness(0) invert(1)" : "none" }} />
);

// ── Rich Text Editor ───────────────────────────────────────────────────────────

function RichTextEditor({ value, onChange, placeholder }: { value: string; onChange: (html: string) => void; placeholder?: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  // Sync external value into DOM only when not focused (e.g. AI sets it)
  useEffect(() => {
    const el = editorRef.current;
    if (!el || focused) return;
    if (el.innerHTML !== value) el.innerHTML = value;
  }, [value, focused]);

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
    });
  };

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current?.innerHTML ?? "");
    updateActiveFormats();
  };

  const toolbarBtn = (cmd: string, icon: React.ReactNode, title: string) => {
    const active = activeFormats[cmd];
    return (
      <button
        key={cmd}
        title={title}
        onMouseDown={e => { e.preventDefault(); exec(cmd); }}
        style={{
          width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          background: active ? "#0b182c" : "transparent", color: active ? "white" : "#5f6369",
          transition: "background 0.1s, color 0.1s",
        }}
      >
        {icon}
      </button>
    );
  };

  const isEmpty = !value || value === "<br>" || value === "<div><br></div>";

  return (
    <div style={{ border: "1px solid #ececec", borderRadius: 16, overflow: "hidden", background: "white" }}>
      {/* Toolbar — only when focused */}
      <div style={{
        display: "flex", alignItems: "center", gap: 2,
        padding: focused ? "8px 12px" : "0 12px",
        height: focused ? "auto" : 0,
        overflow: "hidden",
        borderBottom: focused ? "1px solid #ececec" : "none",
        opacity: focused ? 1 : 0, pointerEvents: focused ? "auto" : "none",
        transition: "opacity 0.15s, padding 0.15s, height 0.15s",
      }}>
        {toolbarBtn("bold", <Bold size={14} strokeWidth={2.5} />, "Bold")}
        {toolbarBtn("italic", <Italic size={14} strokeWidth={2} />, "Italic")}
        {toolbarBtn("underline", <Underline size={14} strokeWidth={2} />, "Underline")}
        <div style={{ width: 1, height: 16, background: "#e8e8e8", margin: "0 4px" }} />
        {toolbarBtn("insertUnorderedList", <List size={14} strokeWidth={2} />, "Bullet list")}
        {toolbarBtn("insertOrderedList", <ListOrdered size={14} strokeWidth={2} />, "Numbered list")}
      </div>

      {/* Editable area */}
      <div style={{ position: "relative" }}>
        {isEmpty && !focused && (
          <div style={{ position: "absolute", top: 16, left: 16, right: 16, pointerEvents: "none", fontSize: 16, color: "#9da1a7", fontFamily: "'Google Sans', sans-serif", lineHeight: 1.6 }}>
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onFocus={() => { setFocused(true); updateActiveFormats(); }}
          onBlur={() => { setFocused(false); onChange(editorRef.current?.innerHTML ?? ""); }}
          onInput={() => { onChange(editorRef.current?.innerHTML ?? ""); updateActiveFormats(); }}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          style={{ minHeight: 140, padding: "16px", fontSize: 16, color: "#0b182c", fontFamily: "'Google Sans', sans-serif", lineHeight: 1.6, outline: "none" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 16px 12px" }}>
        <span style={{ fontSize: 13, color: "#9da1a7" }}>{value.replace(/<[^>]+>/g, "").length} Characters</span>
      </div>
    </div>
  );
}

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6369" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ArrowRightIcon = ({ color = "white" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9da1a7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const MessageCircleIcon = ({ color = "#0b182c" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const PinNavIcon = ({ color = "#0b182c" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="17" x2="12" y2="22"/>
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
  </svg>
);

const PlusCircleIcon = ({ color = "white" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const SettingsIcon = ({ color = "white" }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

// ── Types ──────────────────────────────────────────────────────────────────────
type TabId = "email" | "sms" | "board";
type UploadedImage = { url: string; name: string; file: File };

// ── Brand themes ───────────────────────────────────────────────────────────────
type BrandTheme = { name: string; action: string; active: string; outerBg: string; onOuter: string };
const THEMES: BrandTheme[] = [
  { name: "Avy",           action: "#245b51", active: "#245b51", outerBg: "#245b51", onOuter: "white" },
  { name: "Stockholmshem", action: "#009B57", active: "#009B57", outerBg: "#F5F5F5", onOuter: "#0b182c" },
  { name: "Balder",        action: "#C4391C", active: "#C4391C", outerBg: "#F5F5F5", onOuter: "#0b182c" },
];

// ── Channel Toggle ─────────────────────────────────────────────────────────────
function ChannelToggle({ active, onChange, enabled, activeColor }: { active: TabId; onChange: (t: TabId) => void; enabled: Record<TabId, boolean>; activeColor: string }) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "email", label: "Email" },
    { id: "sms",   label: "SMS" },
    { id: "board", label: "Digital boards" },
  ];
  const visible = tabs.filter(t => enabled[t.id]);
  if (visible.length === 0) return null;
  return (
    <div className="flex items-center w-full p-1 rounded-full" style={{ background: "#f3f3f3" }}>
      {visible.map(({ id, label }) => (
        <button
          key={id}
          data-pres={`tab-${id}`}
          onClick={() => onChange(id)}
          className="flex flex-1 items-center justify-center rounded-full transition-all"
          style={{
            height: 32,
            background: active === id ? activeColor : "transparent",
            fontFamily: "'Google Sans', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: active === id ? "white" : "#0b182c",
            boxShadow: active === id ? "0px 1px 1px rgba(16,24,40,0.05)" : "none",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Email Preview ──────────────────────────────────────────────────────────────
function EmailPreview({ title, description, images, themeName }: { title: string; description: string; images: UploadedImage[]; themeName: string }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ border: "1px solid #ececec", background: "white" }}>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-0.5" style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 13, color: "#5f6369", lineHeight: "20px" }}>
          <span>From: noreply@avy.se</span>
          <span>To: residents@avy.se</span>
          <span>Subject: <span style={{ color: "#0b182c" }}>{title || "Notice"}</span></span>
        </div>
        <div style={{ height: 1, background: "#ececec" }} />
        <div style={{ alignSelf: "flex-start" }}>
          {themeName === "Stockholmshem"
            ? <StockholmshemLogo height={20} />
            : themeName === "Balder"
            ? <BalderLogo height={30} />
            : <AvyLogoDark />}
        </div>
        <div>
          <p style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600, fontSize: 15, color: title ? "#0b182c" : "#5f6369", marginBottom: 8 }}>
            {title || "Notice title"}
          </p>
          <div style={{ height: 1, background: "#ececec", marginBottom: 8 }} />
          {description
            ? <div dangerouslySetInnerHTML={{ __html: description }} style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 14, color: "#5f6369", lineHeight: 1.6 }} />
            : <p style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 14, color: "#9da1a7", lineHeight: 1.6, margin: 0 }}>Your email will appear here as soon as you type</p>}
        </div>
        {images.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {images.map((img, i) => (
              <img key={i} src={img.url} alt={img.name} className="rounded-lg object-cover w-full" style={{ maxHeight: 260 }} />
            ))}
          </div>
        )}
        <div style={{ height: 1, background: "#ececec" }} />
        <div style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 11, color: "#9da1a7", lineHeight: "normal" }}>
          avy förvaltning · Resident adress<br />
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>Unsubscribe</span>
        </div>
      </div>
    </div>
  );
}

// ── SMS Preview ────────────────────────────────────────────────────────────────
function SmsPreview({ title, description, images, actionColor }: { title: string; description: string; images: UploadedImage[]; actionColor: string }) {
  const [shortened, setShortened] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const plainDesc = description.replace(/<[^>]+>/g, "");
  const hasContent = title || plainDesc;
  const displayText = done ? shortened : [title, plainDesc].filter(Boolean).join("\n\n");
  const charCount = displayText.length;

  const handleShorten = async () => {
    if (!hasContent) return;
    setLoading(true);
    setDone(false);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      setShortened(data.shortened || displayText.slice(0, 160));
      setDone(true);
    } catch {
      setShortened(displayText.slice(0, 160));
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setDone(false); setShortened(""); }, [title, description]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full rounded-2xl overflow-hidden p-3 flex flex-col gap-2" style={{ background: "#ffffff", minHeight: 200, border: "1px solid #ececec" }}>
        <div className="text-center" style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 11, color: "#9da1a7", marginBottom: 4 }}>
          avy förvaltning
        </div>
        <div className="flex justify-start">
          <div className="rounded-2xl px-3 py-2 max-w-[85%]" style={{ background: "#f2f2f7", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
            {images.length > 0 && (
              <img src={images[0].url} alt="" className="rounded-xl mb-2 w-full object-cover" style={{ maxHeight: 220 }} />
            )}
            <p style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 13, color: "#0b182c", lineHeight: "18px", whiteSpace: "pre-wrap" }}>
              {displayText || "Your SMS will appear here…"}
            </p>
            <p style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 10, color: "#9da1a7", marginTop: 4 }}>
              {charCount}/160 chars
            </p>
          </div>
        </div>
      </div>
      <button
        data-pres="shorten-btn"
        onClick={handleShorten}
        disabled={loading || !hasContent}
        className="flex items-center justify-center gap-2 w-full rounded-xl transition-all"
        style={{
          height: 36,
          border: "1px solid #d6d8db",
          background: done ? actionColor : "white",
          fontFamily: "'Google Sans', sans-serif",
          fontWeight: 600,
          fontSize: 13,
          color: done ? "white" : "#0b182c",
          opacity: hasContent ? 1 : 0.5,
          cursor: hasContent ? "pointer" : "default",
        }}
      >
        <SparkleIcon />
        {loading ? "Shortening…" : done ? "✓ AI shortened" : "Shorten with AI"}
      </button>
    </div>
  );
}

// ── Board Preview ──────────────────────────────────────────────────────────────
function InAppPreview({ title, description }: { title: string; description: string }) {
  const plain = description.replace(/<[^>]+>/g, "");
  const now = new Date();
  const timeStr = now.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

  const skel = (w: string, h = 10) => (
    <div style={{ width: w, height: h, borderRadius: 6, background: "#e5e5ea" }} />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Phone frame */}
      <div style={{ width: 256, background: "#4a4a52", borderRadius: 44, padding: "14px 10px 24px", boxShadow: "0 16px 48px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 18px 10px", color: "white" }}>
          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "-apple-system, sans-serif" }}>{timeStr}</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <Signal size={13} color="white" strokeWidth={2} />
            <Wifi size={13} color="white" strokeWidth={2} />
            <Battery size={13} color="white" strokeWidth={2} />
          </div>
        </div>

        {/* Screen */}
        <div style={{ background: "#f2f2f7", borderRadius: 32, overflow: "hidden", padding: "0 0 10px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* App top bar */}
          <div style={{ background: "white", padding: "14px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src="/avy_logo.png" alt="Avy" style={{ height: 18, width: "auto", display: "block" }} />
            <div style={{ width: 28, height: 28, borderRadius: 9, background: "#f2f2f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#d1d1d6" }} />
            </div>
          </div>

          {/* Notification banner */}
          <div style={{ margin: "0 10px", background: "white", borderRadius: 16, padding: "11px 12px", boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: "#0b182c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src="/avy_logo.png" alt="Avy" style={{ height: 13, width: "auto", filter: "invert(1)" }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#6c6c70", fontFamily: "-apple-system, sans-serif", flex: 1, letterSpacing: "0.03em" }}>AVY</span>
              <span style={{ fontSize: 10, color: "#aeaeb2", fontFamily: "-apple-system, sans-serif" }}>now</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#000", margin: "0 0 2px", fontFamily: "-apple-system, sans-serif", lineHeight: 1.35 }}>
              {title || "Notice title"}
            </p>
            <p style={{ fontSize: 11, color: "#3c3c43", margin: 0, fontFamily: "-apple-system, sans-serif", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {plain || "Your notice description will appear here"}
            </p>
          </div>

          {/* Skeleton app content */}
          <div style={{ margin: "0 10px", background: "white", borderRadius: 16, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "#e5e5ea", flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                {skel("70%", 8)}
                {skel("45%", 7)}
              </div>
            </div>
            <div style={{ height: 1, background: "#f0f0f0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {skel("90%", 8)}
              {skel("75%", 8)}
              {skel("55%", 8)}
            </div>
          </div>

          <div style={{ margin: "0 10px", background: "white", borderRadius: 16, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {skel("40%", 8)}
              {skel("20%", 7)}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ flex: 1, height: 56, borderRadius: 10, background: "#e5e5ea" }} />
              <div style={{ flex: 1, height: 56, borderRadius: 10, background: "#e5e5ea" }} />
            </div>
          </div>

          <div style={{ margin: "0 10px", background: "white", borderRadius: 16, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "#e5e5ea", flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                {skel("60%", 8)}
                {skel("40%", 7)}
              </div>
            </div>
            <div style={{ height: 1, background: "#f0f0f0" }} />
            {skel("80%", 8)}
            {skel("65%", 8)}
          </div>

          {/* Home indicator */}
          <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 0" }}>
            <div style={{ width: 100, height: 4, background: "#1c1c1e", borderRadius: 2, opacity: 0.15 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardPreview({ title, description, images, actionColor, themeName }: { title: string; description: string; images: UploadedImage[]; actionColor: string; themeName: string }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="w-full rounded-2xl overflow-hidden relative flex flex-col" style={{ background: actionColor, minHeight: 340 }}>
      <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

      <div className="flex items-center justify-between px-5 pt-4 pb-3 relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        {themeName === "Stockholmshem"
          ? <StockholmshemLogo height={24} inverted />
          : themeName === "Balder"
          ? <BalderLogo height={24} inverted />
          : <AvyLogo />}
        <div className="text-right">
          <div style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700, fontSize: 18, color: "white", lineHeight: 1 }}>{timeStr}</div>
          <div style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{dateStr}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5 flex-1 relative">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-full" style={{ width: 24, height: 24, background: "rgba(255,255,255,0.15)" }}>
            <PinNavIcon color="white" />
          </div>
          <span style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em" }}>
            NOTICE BOARD
          </span>
        </div>

        {images.length > 0 && (
          <img src={images[0].url} alt="" className="w-full rounded-xl object-cover" style={{ maxHeight: 200 }} />
        )}

        <h2 style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700, fontSize: 20, color: "white", lineHeight: 1.2, margin: 0 }}>
          {title || <span style={{ opacity: 0.35 }}>Notice title</span>}
        </h2>

        <p style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: "19px", margin: 0 }}>
          {(() => { const plain = description.replace(/<[^>]+>/g, ""); return plain ? (plain.length > 180 ? plain.slice(0, 180) + "…" : plain) : <span style={{ opacity: 0.5 }}>Notice description will appear here</span>; })()}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
            Kungsgatan 14 · Entrance display
          </span>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
        </div>
      </div>
    </div>
  );
}

// ── Global styles ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    .nav-item:not(.nav-active):hover { background: #f3f4f5 !important; }
    .sub-item:not(.nav-active):hover { background: #f3f4f5 !important; }
    .action-btn:hover { background: rgba(255,255,255,0.08) !important; }
    .ghost-btn:hover { background: #f3f4f5 !important; }
    .tag-chip { cursor: pointer; transition: background 0.15s, color 0.15s; }
    .tag-chip:hover { background: #e4eeec !important; }
    .tag-chip.tag-active:hover { background: #1a4840 !important; }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ai-panel { animation: slideDown 0.22s ease; }
    @keyframes presRipple {
      0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.5; }
      100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
    }
    @keyframes presModalIn {
      from { opacity: 0; transform: translateY(24px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .pres-modal { animation: presModalIn 0.35s cubic-bezier(0.22,1,0.36,1); }
    .pres-cursor {
      position: fixed; pointer-events: none; z-index: 99999;
      transition: left 0.55s cubic-bezier(0.4,0,0.2,1), top 0.55s cubic-bezier(0.4,0,0.2,1);
      filter: drop-shadow(0 3px 10px rgba(0,0,0,0.35));
    }
    .theme-card { cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
    .theme-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; }
  `}</style>
);

// ── Sidebar ────────────────────────────────────────────────────────────────────
const TOP_NAV = [
  { id: "residents",    label: "Residents",    Icon: Users },
  { id: "communicate",  label: "Communicate",  Icon: MessagesSquare },
  { id: "ai-assistant", label: "AI Assistant", Icon: Bot },
  { id: "cases",        label: "Cases",        Icon: ClipboardList },
  { id: "manage",       label: "Manage",       Icon: Settings2 },
  { id: "market",       label: "Market",       Icon: ShoppingBag },
];

const SUB_NAV = [
  { id: "notice-board", label: "Notice board", badge: 2 },
  { id: "library",      label: "Library" },
  { id: "knowledge",    label: "Knowledge cards" },
  { id: "community",    label: "Community" },
  { id: "polls",        label: "Polls" },
];

function Sidebar({ activeNav, setActiveNav, activeColor, presRunning, presPaused, onStartDemo, onResume, onPause, onRestart }: { activeNav: string; setActiveNav: (id: string) => void; activeColor: string; presRunning: boolean; presPaused: boolean; onStartDemo: () => void; onResume: () => void; onPause: () => void; onRestart: () => void; }) {
  const isSubActive = SUB_NAV.some(s => s.id === activeNav);
  const communicateActive = activeNav === "communicate" || isSubActive;

  return (
    <div className="flex flex-col shrink-0" style={{ width: 260, borderRight: "1px solid #ededed", padding: "28px 10px" }}>
      <div className="flex flex-col gap-1 flex-1">
      {TOP_NAV.map(({ id, label, Icon }) => {
        const active = activeNav === id || (id === "communicate" && isSubActive);
        return (
          <div key={id}>
            <button
              onClick={() => setActiveNav(id === "communicate" ? (communicateActive ? id : "notice-board") : id)}
              className={`nav-item flex items-center gap-3 w-full rounded-full transition-colors${active && id !== "communicate" ? " nav-active" : ""}`}
              style={{ padding: "10px 16px", background: active && id !== "communicate" ? activeColor : "transparent" }}
            >
              <Icon size={18} color={active && id !== "communicate" ? "white" : "#0b182c"} strokeWidth={1.8} />
              <span className="flex-1 text-left" style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 14, fontWeight: active ? 600 : 400, color: active && id !== "communicate" ? "white" : "#0b182c" }}>
                {label}
              </span>
              {id === "communicate" && (
                <ChevronDown size={14} color="#9da1a7" strokeWidth={2} style={{ transform: communicateActive ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }} />
              )}
            </button>

            {id === "communicate" && communicateActive && (
              <div className="flex flex-col gap-[2px] mt-1 ml-2">
                {SUB_NAV.map(sub => {
                  const subActive = activeNav === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveNav(sub.id)}
                      className={`sub-item flex items-center gap-2 w-full rounded-full transition-colors${subActive ? " nav-active" : ""}`}
                      style={{ padding: "9px 16px 9px 30px", background: subActive ? activeColor : "transparent" }}
                    >
                      <span className="flex-1 text-left" style={{ fontFamily: "'Google Sans', sans-serif", fontSize: 13, fontWeight: subActive ? 600 : 400, color: subActive ? "white" : "#0b182c" }}>
                        {sub.label}
                      </span>
                      {sub.badge !== undefined && (
                        <span className="flex items-center justify-center rounded-full" style={{ minWidth: 20, height: 20, padding: "0 6px", background: subActive ? "rgba(255,255,255,0.25)" : "#e8e8e8", fontFamily: "'Google Sans', sans-serif", fontWeight: 600, fontSize: 11, color: subActive ? "white" : "#0b182c" }}>
                          {sub.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      </div>

      {/* Demo controls at bottom of sidebar */}
      <div style={{ borderTop: "1px solid #ededed", paddingTop: 16, marginTop: 8 }}>
        {presRunning ? (
          <button onClick={onRestart} className="flex items-center gap-2 w-full rounded-full"
            style={{ padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Google Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#9da1a7" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
            Restart demo
          </button>
        ) : presPaused ? (
          <div className="flex flex-col gap-1">
            <button onClick={onResume} className="flex items-center gap-2 w-full rounded-full"
              style={{ padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Google Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#0b182c" }}>
              <svg width="12" height="14" viewBox="0 0 10 12" fill="currentColor"><path d="M0 1.5C0 .7.9.2 1.6.6l8 5a1 1 0 0 1 0 1.8l-8 5C.9 12.8 0 12.3 0 11.5v-10Z"/></svg>
              Continue demo
            </button>
            <button onClick={onRestart} className="flex items-center gap-2 w-full rounded-full"
              style={{ padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Google Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#9da1a7" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
              Restart demo
            </button>
          </div>
        ) : (
          <button onClick={onStartDemo} className="flex items-center gap-2 w-full rounded-full"
            style={{ padding: "10px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "'Google Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#0b182c" }}>
            <svg width="12" height="14" viewBox="0 0 10 12" fill="currentColor"><path d="M0 1.5C0 .7.9.2 1.6.6l8 5a1 1 0 0 1 0 1.8l-8 5C.9 12.8 0 12.3 0 11.5v-10Z"/></svg>
            Start demo
          </button>
        )}
      </div>
    </div>
  );
}

// ── Smart date parser ──────────────────────────────────────────────────────────
function parseSmartDate(text: string): string {
  const lower = text.toLowerCase();
  const now = new Date();
  let d: Date | null = null;
  let h = 9, m = 0;

  const t24 = lower.match(/\b(\d{1,2}):(\d{2})\b/);
  if (t24) { h = +t24[1]; m = +t24[2]; }
  const tAmPm = lower.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (tAmPm) {
    h = +tAmPm[1]; m = tAmPm[2] ? +tAmPm[2] : 0;
    if (tAmPm[3] === "pm" && h < 12) h += 12;
    if (tAmPm[3] === "am" && h === 12) h = 0;
  }

  if (/\btoday\b/.test(lower)) {
    d = new Date(now);
  } else if (/\btomorrow\b/.test(lower)) {
    d = new Date(now); d.setDate(d.getDate() + 1);
  } else if (/\bnext week\b/.test(lower)) {
    d = new Date(now); d.setDate(d.getDate() + 7);
  } else {
    const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    for (let i = 0; i < days.length; i++) {
      const short = days[i].slice(0, 3);
      if (new RegExp(`\\b${days[i]}|\\b${short}`).test(lower)) {
        d = new Date(now);
        let diff = i - d.getDay();
        if (diff <= 0) diff += 7;
        if (lower.includes("next ")) diff += 7;
        d.setDate(d.getDate() + diff);
        break;
      }
    }
    if (!d) {
      const months = ["january","february","march","april","may","june","july","august","september","october","november","december"];
      for (let mi = 0; mi < months.length; mi++) {
        const mo = months[mi];
        const mShort = mo.slice(0, 3);
        const re = new RegExp(`\\b(?:${mo}|${mShort})\\s+(\\d{1,2})|\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:${mo}|${mShort})\\b`);
        const mm = lower.match(re);
        if (mm) {
          const day = +(mm[1] || mm[2]);
          d = new Date(now.getFullYear(), mi, day);
          if (d < now) d.setFullYear(d.getFullYear() + 1);
          break;
        }
      }
    }
  }

  if (!d) return "";
  d.setHours(h, m, 0, 0);
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function formatDateDisplay(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

const ALL_TAGS = ["Water shutoff","Planned maintenance","Electricity","Heating","Elevator","Common areas","Parking","Noise","Fire alarm","Package delivery","Inspection","Urgent","Cleaning","Security","Renovation","Garden","Laundry room","Recycling","Moving","Pets"];

// ── Main page ──────────────────────────────────────────────────────────────────
export default function NoticePage() {
  const [activeNav,   setActiveNav]   = useState("notice-board");
  const [activeTab,   setActiveTab]   = useState<TabId>("email");
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [aiComposer,  setAiComposer]  = useState(false);
  const [aiPrompt,    setAiPrompt]    = useState("");
  const [aiTags,      setAiTags]      = useState<string[]>([]);
  const [aiLoading,   setAiLoading]   = useState(false);
  const [aiResult,    setAiResult]    = useState<{ title: string; description: string } | null>(null);
  const [aiError,     setAiError]     = useState("");
  const [images,      setImages]      = useState<UploadedImage[]>([]);
  const [dragging,    setDragging]    = useState(false);
  const [enabledChannels, setEnabledChannels] = useState({ email: true, sms: true, board: true });
  const [avyOnly, setAvyOnly] = useState(false);

  // Settings step
  const [step,            setStep]            = useState<"compose" | "settings">("compose");
  const [internalName,    setInternalName]    = useState("");
  const [publishDate,     setPublishDate]     = useState("");
  const [unpublishDate,   setUnpublishDate]   = useState("");
  const [pinnedMessage,   setPinnedMessage]   = useState(false);
  const [pushNotif,       setPushNotif]       = useState(false);
  const [usedByChatbot,   setUsedByChatbot]   = useState(false);
  const [settingsTags,    setSettingsTags]    = useState<string[]>([]);
  const [showAllTags,     setShowAllTags]     = useState(false);

  // Brand theme
  const [theme, setTheme] = useState<BrandTheme>(THEMES[0]);

  const [sendViaOpen, setSendViaOpen] = useState(false);

  // Presentation mode
  const [showStartModal,  setShowStartModal]  = useState(true);
  const [showEndModal,    setShowEndModal]    = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [endModalTab,     setEndModalTab]     = useState(0);
  const [presRunning,     setPresRunning]     = useState(false);
  const [presPaused,      setPresPaused]      = useState(false);
  const presAbortRef = useRef(false);
  const [cursorPos,       setCursorPos]       = useState({ x: -300, y: -300 });
  const [cursorVisible,   setCursorVisible]   = useState(false);
  const [cursorClick,     setCursorClick]     = useState(false);
  const [selectedThemeIdx, setSelectedThemeIdx] = useState(0);

  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
  const abortableSleep = (ms: number) => new Promise<void>((r) => {
    const t = setTimeout(r, ms);
    const check = setInterval(() => { if (presAbortRef.current) { clearTimeout(t); clearInterval(check); r(); } }, 50);
  });

  const stopPresentation = () => {
    presAbortRef.current = true;
    setPresRunning(false);
    setPresPaused(true);
    setCursorVisible(false);
  };

  const triggerPublish = () => {
    setCursorVisible(false);
    setPresRunning(false);
    setPresPaused(false);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setShowEndModal(true);
    }, 3000);
  };

  const resumePresentation = () => {
    setPresPaused(false);
    runPresentation(theme);
  };

  const getCenter = (sel: string) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
  };

  const moveTo = async (sel: string, pause = 700) => {
    const pos = getCenter(sel);
    if (pos) setCursorPos(pos);
    await sleep(pause);
  };

  const presClickEl = async (el: HTMLElement | null, action?: () => void, pause = 500) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCursorPos({ x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
    await sleep(650);
    setCursorClick(true);
    await sleep(130);
    if (action) action(); else el.click();
    await sleep(130);
    setCursorClick(false);
    await sleep(pause);
  };

  const presClick = async (sel: string, action?: () => void, pause = 500) => {
    await moveTo(sel, 650);
    setCursorClick(true);
    await sleep(130);
    if (action) action();
    else (document.querySelector(sel) as HTMLElement | null)?.click();
    await sleep(130);
    setCursorClick(false);
    await sleep(pause);
  };

  const presType = async (setter: (v: string) => void, text: string, speed = 38) => {
    for (let i = 0; i <= text.length; i++) {
      setter(text.slice(0, i));
      await sleep(speed + Math.random() * 18);
    }
  };

  const runPresentation = async (t?: BrandTheme) => {
    presAbortRef.current = false;
    setPresRunning(true);
    setCursorVisible(true);
    setCursorPos({ x: window.innerWidth * 0.55, y: 80 });

    const PROMPT = "Painting the stair well next week. Friendly heads up.";
    const AI_TITLE = "Stairwell Refresh Next Week";
    const AI_DESC = "Hi neighbours! Just a friendly heads up — we will be giving the stairwell a fresh coat of paint starting next week. It is going to look great! There may be a mild smell of paint for a day or two, so feel free to keep windows open. We appreciate your patience and are excited for you to see the result!";

    await sleep(1000);

    // 1. Click Generate with Davy
    await presClick('[data-pres="davy-toggle"]', () => setAiComposer(true), 900);

    // 2. Type prompt
    await moveTo('[data-pres="ai-prompt"]', 600);
    await presType(setAiPrompt, PROMPT, 55);
    await sleep(400);

    // 3. Click relevant tags
    const tagNames = ["Planned maintenance", "Common areas", "Renovation"];
    for (const tag of tagNames) {
      const tagEl = Array.from(document.querySelectorAll(".tag-chip")).find(e => e.textContent?.trim() === tag) as HTMLElement | null;
      await presClickEl(tagEl, () => setAiTags(prev => prev.includes(tag) ? prev : [...prev, tag]), 500);
    }
    await sleep(500);

    // 4. Click Generate
    await presClick('[data-pres="ai-generate"]', () => { setAiLoading(true); setAiError(""); }, 400);
    await sleep(2200);
    setAiLoading(false);

    // Switch to result view with empty fields, scroll to top
    setAiResult({ title: "", description: "" });
    const scrollEl = document.querySelector('[data-pres="compose-scroll"]') as HTMLElement | null;
    scrollEl?.scrollTo({ top: 0, behavior: "smooth" });
    await sleep(500);

    // Type title character by character
    for (let i = 1; i <= AI_TITLE.length; i++) {
      if (presAbortRef.current) return;
      const t2 = AI_TITLE.slice(0, i);
      setAiResult(r => r ? { ...r, title: t2 } : r);
      await sleep(42);
    }
    await sleep(400);

    // Scroll down to show description area
    scrollEl?.scrollTo({ top: 180, behavior: "smooth" });
    await sleep(300);

    // Type description character by character
    for (let i = 1; i <= AI_DESC.length; i++) {
      if (presAbortRef.current) return;
      const d2 = AI_DESC.slice(0, i);
      setAiResult(r => r ? { ...r, description: d2 } : r);
      await sleep(14);
    }
    await sleep(800);

    // Scroll back to top
    scrollEl?.scrollTo({ top: 0, behavior: "smooth" });
    await sleep(1000);

    // 5. Add image
    await presClick('[data-pres="image-area"]', () => {
      setImages([{ url: "/stair.png", name: "stair.png", file: new File([], "stair.png") }]);
    }, 1200);

    // 6. View Email preview (already active) — linger
    await moveTo('[data-pres="tab-email"]', 1800);

    // 7. Switch to SMS
    await presClick('[data-pres="tab-sms"]', () => setActiveTab("sms"), 1800);

    // 8. Shorten with AI
    await presClick('[data-pres="shorten-btn"]', undefined, 3000);

    // 9. Switch to Digital boards
    await presClick('[data-pres="tab-board"]', () => setActiveTab("board"), 1800);

    // 10. Open SEND VIA and turn off Email
    setSendViaOpen(true);
    await sleep(600);
    await presClick('[data-pres="toggle-email"]', () => toggleChannel("email"), 1000);

    // 11. Next step
    await presClick('[data-pres="next-step"]', () => {
      setInternalName(AI_TITLE);
      setPublishDate(parseSmartDate(PROMPT));
      setSettingsTags(["Planned maintenance", "Common areas", "Renovation"]);
      setStep("settings");
    }, 1200);

    // 12. Look at publish date field
    await moveTo('[data-pres="pub-date"]', 1400);

    // 13. Click push notification
    await presClick('[data-pres="push-notif"]', () => setPushNotif(true), 1200);

    // 14. Publish
    await presClick('[data-pres="publish-btn"]', () => triggerPublish(), 300);
  };

  const toggleChannel = (ch: TabId) => {
    setAvyOnly(false);
    setEnabledChannels(prev => {
      const next = { ...prev, [ch]: !prev[ch] };
      if (ch === activeTab && !next[ch]) {
        const fallback = (["email", "sms", "board"] as TabId[]).find(id => next[id]);
        if (fallback) setActiveTab(fallback);
      }
      return next;
    });
  };

  const toggleAvyOnly = () => {
    if (!avyOnly) {
      setAvyOnly(true);
      setEnabledChannels({ email: false, sms: false, board: false });
    } else {
      setAvyOnly(false);
      setEnabledChannels({ email: true, sms: true, board: true });
      setActiveTab("email");
    }
  };

  const handleGenerate = async () => {
    const context = [aiPrompt, aiTags.length ? `Category tags: ${aiTags.join(", ")}` : ""].filter(Boolean).join("\n");
    if (!context.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    setAiError("");
    try {
      const res = await fetch("/api/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: context }),
      });
      const data = await res.json();
      if (data.error) {
        setAiError("Generation failed. Try again.");
      } else {
        setAiResult({ title: data.title ?? "", description: data.description ?? "" });
      }
    } catch {
      setAiError("Generation failed. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef      = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLTextAreaElement>(null);

  const activeTitle       = aiResult ? aiResult.title : title;
  const activeDescription = aiResult ? aiResult.description : description;

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [activeTitle]);

  const canSubmit = activeDescription.replace(/<[^>]+>/g, "").trim().length > 0;

  const addFiles = useCallback((files: FileList | File[]) => {
    const imgs = Array.from(files).filter(f => f.type.startsWith("image/") || f.type === "application/pdf");
    setImages(prev => [...prev, ...imgs.map(f => ({ url: URL.createObjectURL(f), name: f.name, file: f }))]);
  }, []);

  const removeImage = (i: number) => {
    setImages(prev => { URL.revokeObjectURL(prev[i].url); return prev.filter((_, idx) => idx !== i); });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const resetState = () => {
    setStep("compose");
    setTitle(""); setDescription(""); setImages([]);
    setAiComposer(false); setAiPrompt(""); setAiResult(null); setAiTags([]);
    setEnabledChannels({ email: true, sms: true, board: true }); setAvyOnly(false); setActiveTab("email");
    setInternalName(""); setPublishDate(""); setUnpublishDate(""); setPinnedMessage(false); setPushNotif(false); setUsedByChatbot(false); setSettingsTags([]);
    setCursorPos({ x: -300, y: -300 });
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: theme.outerBg, fontFamily: "'Google Sans', sans-serif" }}>
      <GlobalStyles />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Google+Sans+Text:wght@400;500;700&display=swap" />

      {/* ── Top bar ── */}
      <div className="flex shrink-0 justify-center px-6" style={{ height: 66 }}>
      <div className="flex items-center justify-between w-full" style={{ maxWidth: 1400 }}>
        {theme.name === "Stockholmshem"
          ? <StockholmshemLogo height={28} />
          : theme.name === "Balder"
          ? <BalderLogo height={34} />
          : <AvyLogo />}
        <div className="flex items-center gap-2">
          <button className="action-btn flex items-center gap-3 px-4 rounded-2xl transition-colors" style={{ height: 50, background: "transparent" }}>
            <PlusCircleIcon color={theme.onOuter} />
            <span style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600, fontSize: 14, color: theme.onOuter }}>Quick actions</span>
          </button>
          <button className="action-btn flex items-center gap-3 px-4 rounded-2xl transition-colors" style={{ height: 50, background: "transparent" }}>
            <SettingsIcon color={theme.onOuter} />
            <span style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600, fontSize: 14, color: theme.onOuter }}>Settings</span>
          </button>
          <img
            src="https://i.pravatar.cc/100?img=47"
            alt="avatar"
            className="rounded-full"
            style={{ width: 34, height: 34, objectFit: "cover", border: "2px solid rgba(255,255,255,0.3)" }}
          />
        </div>
      </div>
      </div>

      {/* ── Card ── */}
      <div className="flex flex-1" style={{ background: "white", overflow: "hidden" }}>
        <div className="flex w-full h-full justify-center px-6">
        <div className="flex w-full overflow-hidden" style={{ maxWidth: 1400, height: "calc(100vh - 66px)" }}>

          {/* ── Sidebar ── */}
          <Sidebar
            activeNav={activeNav} setActiveNav={setActiveNav} activeColor={theme.active}
            presRunning={presRunning} presPaused={presPaused}
            onStartDemo={() => setShowStartModal(true)}
            onResume={() => resumePresentation()}
            onPause={() => stopPresentation()}
            onRestart={() => { presAbortRef.current = true; setPresRunning(false); setPresPaused(true); setCursorVisible(false); setShowStartModal(true); }}
          />

          {step === "settings" ? (
            /* ── Settings step ── */
            <div className="flex flex-col flex-1 min-w-0" style={{ borderRight: "1px solid #ededed" }}>
              {/* Sticky breadcrumb */}
              <div className="flex items-center gap-2 shrink-0" style={{ position: "sticky", top: 0, zIndex: 10, background: "white", padding: "14px 40px" }}>
                <button onClick={() => setStep("compose")}><ChevronLeftIcon /></button>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#5f6369", fontFamily: "'Google Sans', sans-serif" }}>
                  Notice board <span style={{ color: "#9da1a7" }}>/ New / Settings</span>
                </span>
              </div>
              <div className="flex flex-col flex-1 overflow-y-auto px-10 pt-8 pb-8 gap-8" style={{ maxWidth: 720 }}>

                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0b182c", fontFamily: "'Google Sans', sans-serif", margin: 0 }}>Settings</h1>

                <div className="flex flex-col">
                  {/* Internal name */}
                  <div className="flex items-start gap-6" style={{ paddingBottom: 20, borderBottom: "1px solid #f0f0f0" }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#0b182c", fontFamily: "'Google Sans', sans-serif", flexShrink: 0, width: 200, paddingTop: 10 }}>Internal name</span>
                    <input value={internalName} onChange={e => setInternalName(e.target.value)} placeholder="Internal name" className="flex-1 outline-none" style={{ height: 44, padding: "0 14px", borderRadius: 10, border: "1px solid #e4e5e7", background: "#fafafa", fontFamily: "'Google Sans', sans-serif", fontSize: 14, color: "#0b182c" }} />
                  </div>

                  {/* Access group */}
                  <div className="flex items-start gap-6" style={{ paddingBottom: 20, borderBottom: "1px solid #f0f0f0", paddingTop: 20 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#0b182c", fontFamily: "'Google Sans', sans-serif", flexShrink: 0, width: 200, paddingTop: 10 }}>Access group</span>
                    <div className="relative flex-1">
                      <select className="w-full outline-none appearance-none" style={{ height: 44, padding: "0 36px 0 14px", borderRadius: 10, border: "1px solid #e4e5e7", background: "#fafafa", fontFamily: "'Google Sans', sans-serif", fontSize: 14, color: "#9da1a7" }}>
                        <option>Bolag 1</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9da1a7" }} />
                    </div>
                  </div>

                  {/* Publish to */}
                  <div className="flex items-start gap-6" style={{ paddingBottom: 20, borderBottom: "1px solid #f0f0f0", paddingTop: 20 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#0b182c", fontFamily: "'Google Sans', sans-serif", flexShrink: 0, width: 200, paddingTop: 10 }}>Publish to</span>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        <span style={{ padding: "4px 12px", borderRadius: 20, background: "#e8edf8", fontSize: 13, fontWeight: 500, fontFamily: "'Google Sans', sans-serif", color: "#3a5bb5" }}>Bolag 1</span>
                      </div>
                      <button className="flex items-center gap-2" style={{ height: 34, padding: "0 14px", borderRadius: 8, border: "1px solid #e4e5e7", background: "white", fontFamily: "'Google Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#0b182c" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit segments
                      </button>
                    </div>
                  </div>

                  {/* Publish date */}
                  <div className="flex items-start gap-6" style={{ paddingBottom: 20, borderBottom: "1px solid #f0f0f0", paddingTop: 20 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#0b182c", fontFamily: "'Google Sans', sans-serif", flexShrink: 0, width: 200, paddingTop: 10 }}>Publish date</span>
                    <input data-pres="pub-date" type="datetime-local" value={publishDate} onChange={e => setPublishDate(e.target.value)} className="flex-1 outline-none" style={{ height: 44, padding: "0 14px", borderRadius: 10, border: "1px solid #e4e5e7", background: "#fafafa", fontFamily: "'Google Sans', sans-serif", fontSize: 14, color: "#0b182c" }} />
                  </div>

                  {/* Unpublish date */}
                  <div className="flex items-start gap-6" style={{ paddingBottom: 20, borderBottom: "1px solid #f0f0f0", paddingTop: 20 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#0b182c", fontFamily: "'Google Sans', sans-serif", flexShrink: 0, width: 200, paddingTop: 10 }}>Unpublish date</span>
                    <input type="datetime-local" value={unpublishDate} onChange={e => setUnpublishDate(e.target.value)} className="flex-1 outline-none" style={{ height: 44, padding: "0 14px", borderRadius: 10, border: "1px solid #e4e5e7", background: "#fafafa", fontFamily: "'Google Sans', sans-serif", fontSize: 14, color: "#0b182c" }} />
                  </div>

                  {/* Checkboxes */}
                  {([
                    { label: "Pinned message",   checked: pinnedMessage, toggle: () => setPinnedMessage(p => !p),   pres: "" },
                    { label: "Push notification", checked: pushNotif,     toggle: () => setPushNotif(p => !p),       pres: "push-notif" },
                    { label: "Used by chatbot",   checked: usedByChatbot, toggle: () => setUsedByChatbot(p => !p),  pres: "" },
                  ] as { label: string; checked: boolean; toggle: () => void; pres: string }[]).map(({ label, checked, toggle, pres }) => (
                    <div key={label} className="flex items-center gap-6" style={{ paddingBottom: 20, borderBottom: "1px solid #f0f0f0", paddingTop: 20 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#0b182c", fontFamily: "'Google Sans', sans-serif", flexShrink: 0, width: 200 }}>{label}</span>
                      <button data-pres={pres || undefined} onClick={toggle} className="flex items-center" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                        <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${checked ? theme.active : "#d6d8db"}`, background: checked ? theme.active : "white", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                          {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                      </button>
                    </div>
                  ))}

                  {/* Tags */}
                  <div className="flex items-start gap-6" style={{ paddingTop: 20 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#0b182c", fontFamily: "'Google Sans', sans-serif", flexShrink: 0, width: 200, paddingTop: 4 }}>Tags</span>
                    <div className="flex flex-col gap-3 flex-1">
                      <div className="flex flex-wrap gap-2">
                        {(showAllTags ? ALL_TAGS : ALL_TAGS.slice(0, 10)).map(tag => {
                          const on = settingsTags.includes(tag);
                          return (
                            <button key={tag} onClick={() => setSettingsTags(prev => on ? prev.filter(t => t !== tag) : [...prev, tag])}
                              style={{ padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, fontFamily: "'Google Sans', sans-serif", background: on ? theme.active : "#f0f0f0", color: on ? "white" : "#5f6369", border: "none", cursor: "pointer", transition: "all 0.15s" }}>
                              {tag}
                            </button>
                          );
                        })}
                        {!showAllTags && ALL_TAGS.length > 10 && (
                          <button onClick={() => setShowAllTags(true)} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, fontFamily: "'Google Sans', sans-serif", background: "white", color: theme.active, border: `1px solid ${theme.active}`, cursor: "pointer" }}>
                            Show all ({ALL_TAGS.length - 10} more)
                          </button>
                        )}
                      </div>
                      <button className="flex items-center gap-2 self-start" style={{ height: 34, padding: "0 14px", borderRadius: 8, border: "1px solid #e4e5e7", background: "white", fontFamily: "'Google Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#0b182c" }}>
                        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Create tag
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="flex items-center justify-end gap-3 px-8 py-4 shrink-0" style={{ borderTop: "1px solid #ededed" }}>
                <button
                  onClick={() => setStep("compose")}
                  className="ghost-btn flex items-center justify-center transition-colors"
                  style={{ height: 48, padding: "0 32px", borderRadius: 16, border: "1px solid #d6d8db", background: "white", fontFamily: "'Google Sans', sans-serif", fontWeight: 600, fontSize: 16, color: "#0b182c" }}
                >
                  Back
                </button>
                <button
                  data-pres="publish-btn"
                  onClick={triggerPublish}
                  className="flex items-center justify-center gap-1 transition-all"
                  style={{ height: 48, paddingLeft: 24, paddingRight: 24, borderRadius: 16, background: theme.action, fontFamily: "'Google Sans', sans-serif", fontWeight: 600, fontSize: 16, color: "white" }}
                >
                  Publish notice
                </button>
              </div>
            </div>
          ) : (
          /* ── Main content ── */
          <div className="flex flex-col flex-1 min-w-0" style={{ borderRight: "1px solid #ededed" }}>
              {/* Sticky breadcrumb */}
              <div className="flex items-center gap-2 shrink-0" style={{ position: "sticky", top: 0, zIndex: 10, background: "white", padding: "14px 40px" }}>
                <button><ChevronLeftIcon /></button>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#5f6369", fontFamily: "'Google Sans', sans-serif" }}>
                  Notice board <span style={{ color: "#9da1a7" }}>/ New</span>
                </span>
              </div>
            <div data-pres="compose-scroll" className="flex flex-col flex-1 overflow-y-auto px-8 pt-4 pb-4 gap-4">

              {/* AI toggle */}
              <div className="flex items-center justify-end gap-3">
                <span style={{ fontSize: 14, fontWeight: 600, color: "#0b182c" }}>Generate with Davy</span>
                <button
                  data-pres="davy-toggle"
                  onClick={() => { setAiComposer(v => !v); if (aiComposer) { setAiResult(null); setAiPrompt(""); } }}
                  style={{ width: 48, height: 26, borderRadius: 9999, background: aiComposer ? theme.action : "#f5f5f5", border: "1px solid #d2d2d2", position: "relative", transition: "background 0.2s" }}
                >
                  <span style={{ position: "absolute", top: 2, width: 22, height: 22, borderRadius: "50%", background: aiComposer ? "white" : "#9da1a7", left: aiComposer ? "calc(100% - 24px)" : 2, transition: "left 0.2s, background 0.2s" }} />
                </button>
              </div>

              {/* AI Composer panel */}
              {aiComposer && !aiResult && (
                <div className="ai-panel flex flex-col gap-4 rounded-2xl p-5" style={{ background: "#f7f7f9", border: "1px solid #ececec" }}>
                  <textarea
                    data-pres="ai-prompt"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Describe your notice — what happened, when, who is affected…"
                    className="w-full outline-none resize-none rounded-xl p-4"
                    style={{ height: 110, fontSize: 15, color: "#0b182c", background: "white", border: "1px solid #e0e0e0", fontFamily: "'Google Sans', sans-serif", lineHeight: 1.6 }}
                  />
                  {/* Tags */}
                  <div className="flex flex-col gap-2">
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#9da1a7", letterSpacing: "0.06em" }}>CATEGORY TAGS</span>
                    <div className="flex flex-wrap gap-2">
                      {["Water shutoff","Planned maintenance","Electricity","Heating","Elevator","Common areas","Parking","Noise","Fire alarm","Package delivery","Inspection","Urgent"].map(tag => {
                        const on = aiTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => setAiTags(prev => on ? prev.filter(t => t !== tag) : [...prev, tag])}
                            className={`tag-chip rounded-full${on ? " tag-active" : ""}`}
                            style={{ padding: "5px 12px", fontSize: 12, fontWeight: 500, fontFamily: "'Google Sans', sans-serif", background: on ? theme.active : "#ecedef", color: on ? "white" : "#5f6369", border: "none" }}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {aiError && (
                    <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#fff0f0", color: "#c0392b", border: "1px solid #fdd", fontFamily: "'Google Sans', sans-serif" }}>
                      {aiError}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      data-pres="ai-generate"
                      onClick={handleGenerate}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="transition-colors"
                      style={{ height: 40, padding: "0 24px", borderRadius: 9999, fontSize: 14, fontWeight: 600, fontFamily: "'Google Sans', sans-serif", background: aiLoading || !aiPrompt.trim() ? "#dcdcdc" : theme.action, color: aiLoading || !aiPrompt.trim() ? "#9da1a7" : "white", transition: "background 0.2s" }}
                    >
                      {aiLoading ? "Generating…" : "✦ Generate notice"}
                    </button>
                  </div>
                </div>
              )}

              {/* Title */}
              {(!aiComposer || aiResult) && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label style={{ fontSize: 13, fontWeight: 500, color: "#0b182c", letterSpacing: "0.04em" }}>TITLE</label>
                    {aiResult && (
                      <button
                        onClick={() => setAiResult(null)}
                        style={{ height: 28, padding: "0 14px", borderRadius: 9999, fontSize: 12, fontWeight: 600, fontFamily: "'Google Sans', sans-serif", background: "white", color: "#0b182c", border: "1px solid #d6d8db" }}
                      >
                        ✦ Generate new
                      </button>
                    )}
                  </div>
                  <div style={{ borderBottom: "1px solid #ededed", paddingBottom: 0, marginBottom: 24 }}>
                    <textarea
                      ref={titleRef}
                      autoFocus
                      value={activeTitle}
                      onChange={e => {
                        if (aiResult) setAiResult(r => r ? { ...r, title: e.target.value } : r);
                        else setTitle(e.target.value);
                      }}
                      placeholder="Write your title..."
                      className="w-full bg-transparent outline-none resize-none overflow-hidden block"
                      style={{ fontSize: 42, fontStyle: activeTitle ? "normal" : "italic", color: activeTitle ? "#0b182c" : "#5f6369", fontFamily: "'Google Sans', sans-serif", lineHeight: 1.1, height: "auto", minHeight: Math.round(42 * 1.1) + "px" }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {(!aiComposer || aiResult) && (
                <div className="flex flex-col gap-3">
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#0b182c", letterSpacing: "0.04em" }}>DESCRIPTION</label>
                  <RichTextEditor
                    value={activeDescription}
                    onChange={html => aiResult ? setAiResult(r => r ? { ...r, description: html } : r) : setDescription(html)}
                    placeholder="Describe your notice here..."
                  />
                </div>
              )}

              {/* Images & Documents */}
              <div className="flex flex-col gap-3">
                <label style={{ fontSize: 14, fontWeight: 500, color: "#0b182c", letterSpacing: "0.04em" }}>IMAGES AND DOCUMENTS</label>

                {images.length > 0 && (
                  <div className="flex flex-col gap-3 w-full">
                    {images.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden w-full">
                        <img src={img.url} alt={img.name} className="w-full object-cover rounded-xl" style={{ maxHeight: 320, display: "block" }} />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 flex items-center justify-center rounded-full"
                          style={{ width: 28, height: 28, background: "rgba(0,0,0,0.55)", color: "white" }}
                        >
                          <XIcon />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 w-full rounded-xl"
                      style={{ height: 100, border: "1.5px dashed #9da1a7", background: "white", fontSize: 13, color: "#9da1a7" }}
                    >
                      <span style={{ fontSize: 24, lineHeight: 1 }}>+</span>
                      <span>Add more</span>
                    </button>
                  </div>
                )}

                {images.length === 0 && (
                  <div
                    data-pres="image-area"
                    ref={dropRef}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl transition-colors"
                    style={{ width: 238, background: dragging ? "#f0f8f6" : "white", border: `1px dashed ${dragging ? theme.active : "#9da1a7"}` }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <ImagePlaceholderIcon />
                      <span className="text-center" style={{ fontSize: 13, color: "#5f6369", lineHeight: "20px" }}>
                        Drag and drop to upload{"\n"}images or documents
                      </span>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center"
                      style={{ height: 32, padding: "0 24px", borderRadius: 16, border: "1px solid #d6d8db", background: "white", fontSize: 13, fontWeight: 600, color: "#0b182c", fontFamily: "'Google Sans', sans-serif" }}
                    >
                      Select files
                    </button>
                  </div>
                )}

                <input ref={fileInputRef} type="file" className="hidden" multiple accept="image/*,.pdf" onChange={e => e.target.files && addFiles(e.target.files)} />
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-end gap-3 px-8 shrink-0" style={{ borderTop: "1px solid #ededed", height: 72 }}>
              <button
                className="ghost-btn flex items-center justify-center transition-colors"
                style={{ height: 48, padding: "0 32px", borderRadius: 16, border: "1px solid #d6d8db", background: "white", fontFamily: "'Google Sans', sans-serif", fontWeight: 600, fontSize: 16, color: "#0b182c" }}
              >
                Cancel
              </button>
              <button
                data-pres="next-step"
                disabled={!canSubmit}
                onClick={() => {
                  const combined = [activeTitle, activeDescription].join(" ");
                  setInternalName(activeTitle);
                  setPublishDate(parseSmartDate(combined));
                  setSettingsTags(aiTags.length ? [...aiTags] : []);
                  setStep("settings");
                }}
                className="flex items-center justify-center gap-1 transition-all"
                style={{
                  height: 48, paddingLeft: 24, paddingRight: 16, borderRadius: 16,
                  background: canSubmit ? theme.action : "#dcdcdc",
                  fontFamily: "'Google Sans', sans-serif", fontWeight: 600, fontSize: 16,
                  color: "white", cursor: canSubmit ? "pointer" : "default",
                  transition: "background 0.2s",
                }}
              >
                Next step <ArrowRightIcon color="white" />
              </button>
            </div>
          </div>) }

          {/* ── Channel preview ── always visible ── */}
          <div className="flex flex-col shrink-0" style={{ width: 446, background: "white" }}>
            {/* Scrollable preview area */}
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto" style={{ padding: "33px 16px 16px" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#0b182c", letterSpacing: "0.04em" }}>CHANNEL PREVIEW</p>

              {Object.values(enabledChannels).some(Boolean) ? (
                <>
                  <ChannelToggle active={activeTab} onChange={setActiveTab} enabled={enabledChannels} activeColor={theme.active} />
                  {activeTab === "email" && <EmailPreview title={activeTitle} description={activeDescription} images={images} themeName={theme.name} />}
                  {activeTab === "sms"   && <SmsPreview   title={activeTitle} description={activeDescription} images={images} actionColor={theme.action} />}
                  {activeTab === "board" && <BoardPreview title={activeTitle} description={activeDescription} images={images} actionColor={theme.action} themeName={theme.name} />}
                  <button
                    className="flex items-center justify-center self-start"
                    style={{ height: 32, padding: "0 24px", borderRadius: 16, border: "1px solid #d6d8db", background: "white", fontFamily: "'Google Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#0b182c" }}
                  >
                    Edit {activeTab === "email" ? "Email" : activeTab === "sms" ? "SMS" : "Digital boards"} version
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <p style={{ fontSize: 13, color: "#9da1a7", fontFamily: "'Google Sans', sans-serif", margin: 0, textAlign: "center", lineHeight: 1.5 }}>
                    Sent inside the Avy app only — residents get a push notification if enabled.
                  </p>
                  <InAppPreview title={activeTitle} description={activeDescription} />
                </div>
              )}
            </div>

            {/* Channel enable/disable box */}
            <div className="shrink-0" style={{ borderTop: "1px solid #ededed" }}>
              <button
                onClick={() => setSendViaOpen(v => !v)}
                className="flex items-center justify-between w-full"
                style={{ height: 72, padding: "0 16px", background: "none", border: "none", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${theme.active}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.active} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0b182c", fontFamily: "'Google Sans', sans-serif" }}>Send via</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {!sendViaOpen && (
                    <span style={{ fontSize: 12, color: "#9da1a7", fontFamily: "'Google Sans', sans-serif" }}>
                      {avyOnly ? "App only" : Object.entries(enabledChannels).filter(([,v]) => v).map(([k]) => k === "board" ? "Board" : k.charAt(0).toUpperCase() + k.slice(1)).join(", ")}
                    </span>
                  )}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9da1a7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: sendViaOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </button>
              {sendViaOpen && (
                <div style={{ padding: "0 16px 12px" }}>
                  <button
                    onClick={toggleAvyOnly}
                    className="flex items-center gap-2 w-full"
                    style={{ marginBottom: 6, padding: "0 2px", background: "none", border: "none" }}
                  >
                    <div style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0, border: `2px solid ${avyOnly ? theme.active : "#d6d8db"}`, background: avyOnly ? theme.active : "white", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                      {avyOnly && <svg width="8" height="6" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, fontFamily: "'Google Sans', sans-serif", color: avyOnly ? theme.active : "#5f6369" }}>Only send in Avy app</span>
                  </button>
                  <div className="flex flex-col gap-1" style={{ opacity: avyOnly ? 0.4 : 1, pointerEvents: avyOnly ? "none" : "auto", transition: "opacity 0.2s" }}>
                    {([
                      { id: "email" as TabId, label: "Email" },
                      { id: "sms"   as TabId, label: "SMS" },
                      { id: "board" as TabId, label: "Digital boards" },
                    ] as { id: TabId; label: string }[]).map(({ id, label }) => {
                      const on = enabledChannels[id];
                      return (
                        <button key={id} data-pres={`toggle-${id}`} onClick={() => toggleChannel(id)}
                          className="flex items-center justify-between w-full"
                          style={{ height: 34, padding: "0 10px", borderRadius: 8, border: "none", background: on ? "#f0f6f5" : "#f7f8f8", transition: "all 0.15s" }}>
                          <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "'Google Sans', sans-serif", color: on ? theme.active : "#5f6369" }}>{label}</span>
                          <div style={{ width: 30, height: 17, borderRadius: 9, background: on ? theme.active : "#d6d8db", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                            <div style={{ position: "absolute", top: 2, left: on ? 14 : 2, width: 13, height: 13, borderRadius: 7, background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
        </div>
      </div>

      {/* ── Presentation cursor ── */}
      {cursorVisible && (
        <div
          className="pres-cursor"
          style={{ left: cursorPos.x, top: cursorPos.y, transform: `translate(-4px, -2px) scale(${cursorClick ? 0.85 : 1})`, transition: "left 0.55s cubic-bezier(0.4,0,0.2,1), top 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.12s ease" }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M5.5 3.21V20.8l4.75-4.75 2.93 6.75 2.27-.98-2.93-6.75H18l-12.5-12z" fill="white" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
          {cursorClick && (
            <div style={{ position: "absolute", top: "50%", left: "50%", width: 36, height: 36, borderRadius: "50%", background: "rgba(29,51,51,0.2)", animation: "presRipple 0.4s ease-out forwards" }} />
          )}
        </div>
      )}

      {/* ── Start modal ── */}
      {showStartModal && (
        <div onClick={() => { setTheme(THEMES[selectedThemeIdx]); setShowStartModal(false); }} style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)" }}>
          <div className="pres-modal" onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 32, padding: "64px 64px 56px", maxWidth: 600, width: "90%", textAlign: "center", boxShadow: "0 8px 48px rgba(11,24,44,0.12), 0 1px 3px rgba(11,24,44,0.06)" }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0b182c", margin: "0 0 12px", fontFamily: "'Google Sans', sans-serif" }}>Notice Board Demo</h2>
            <p style={{ fontSize: 15, color: "#5f6369", margin: "0 0 48px", lineHeight: 1.7, fontFamily: "'Google Sans', sans-serif" }}>
              Choose a brand, then watch how easy it is to create and send a notice to your residents.
            </p>

            {/* Brand selector */}
            <div className="flex gap-4 mb-12" style={{ justifyContent: "center" }}>
              {THEMES.map((t, idx) => {
                const selected = selectedThemeIdx === idx;
                return (
                  <button
                    key={t.name}
                    className="theme-card flex flex-col items-center gap-3"
                    onClick={() => setSelectedThemeIdx(idx)}
                    style={{
                      flex: 1,
                      padding: "24px 16px",
                      borderRadius: 20,
                      border: selected ? `2px solid ${t.action}` : "2px solid #e8e8e8",
                      background: selected ? `${t.action}08` : "#fafafa",
                      cursor: "pointer",
                      transition: "border 0.15s, background 0.15s",
                    }}
                  >
                    {/* Logo */}
                    <div style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {t.name === "Stockholmshem"
                        ? <StockholmshemLogo height={22} />
                        : t.name === "Balder"
                        ? <BalderLogo height={34} />
                        : <img src="/avy_logo.png" alt="Avy" style={{ height: 20, width: "auto", display: "block", filter: "brightness(0)" }} />}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: selected ? 700 : 500, color: selected ? t.action : "#9da1a7", fontFamily: "'Google Sans', sans-serif", lineHeight: 1.2 }}>
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  const t = THEMES[selectedThemeIdx];
                  setTheme(t);
                  setShowStartModal(false);
                  resetState();
                  setPresPaused(false);
                  runPresentation(t);
                }}
                style={{ height: 54, padding: "0 44px", borderRadius: 9999, background: THEMES[selectedThemeIdx].action, color: "white", fontSize: 16, fontWeight: 600, fontFamily: "'Google Sans', sans-serif", cursor: "pointer", border: "none", width: "100%" }}
              >
                Start presentation
              </button>
              <button
                onClick={() => {
                  setTheme(THEMES[selectedThemeIdx]);
                  setShowStartModal(false);
                }}
                style={{ height: 44, padding: "0 24px", borderRadius: 9999, background: "none", color: "#9da1a7", fontSize: 14, fontWeight: 500, fontFamily: "'Google Sans', sans-serif", cursor: "pointer", border: "none" }}
              >
                Explore on my own
              </button>
              <button
                onClick={() => {
                  setTheme(THEMES[selectedThemeIdx]);
                  setShowStartModal(false);
                  setEndModalTab(0);
                  setShowEndModal(true);
                }}
                style={{ height: 36, padding: "0 16px", borderRadius: 9999, background: "none", color: "#9da1a7", fontSize: 13, fontWeight: 500, fontFamily: "'Google Sans', sans-serif", cursor: "pointer", border: "none", textDecoration: "underline", textUnderlineOffset: 3 }}
              >
                About the design
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Send confirmation ── */}
      {showConfirmation && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: theme.action, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M7 16l6 6L25 10" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#0b182c", margin: "0 0 6px", fontFamily: "'Google Sans', sans-serif" }}>Notice published!</p>
              <p style={{ fontSize: 15, color: "#9da1a7", margin: 0, fontFamily: "'Google Sans', sans-serif" }}>Residents have been notified</p>
            </div>
          </div>
        </div>
      )}

      {/* ── End modal ── */}
      {showEndModal && (
        <div onClick={() => setShowEndModal(false)} style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", padding: "24px" }}>
          <div className="pres-modal" onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: 32, maxWidth: 900, width: "100%", overflow: "hidden", height: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 48px rgba(11,24,44,0.12), 0 1px 3px rgba(11,24,44,0.06)" }}>

            {/* Header */}
            <div style={{ padding: "48px 60px 0" }}>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0b182c", margin: "0 0 8px", fontFamily: "'Google Sans', sans-serif" }}>About this design</h2>
                <p style={{ fontSize: 15, color: "#9da1a7", margin: 0, fontFamily: "'Google Sans', sans-serif" }}>Notice board · Avy property management</p>
              </div>

              {/* Tab nav */}
              <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #f0f0f0" }}>
                {["Overview", "Reasoning"].map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setEndModalTab(i)}
                    style={{
                      padding: "10px 20px", background: "none", border: "none", cursor: "pointer",
                      fontSize: 14, fontWeight: endModalTab === i ? 600 : 500,
                      color: endModalTab === i ? "#0b182c" : "#9da1a7",
                      fontFamily: "'Google Sans', sans-serif",
                      borderBottom: endModalTab === i ? "2px solid #245b51" : "2px solid transparent",
                      marginBottom: -1, transition: "color 0.15s, border-color 0.15s",
                    }}
                  >{tab}</button>
                ))}
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ overflowY: "auto", flex: 1 }}>

              {endModalTab === 0 && <>
                {/* Workflow */}
                <div style={{ padding: "36px 60px", borderBottom: "1px solid #f0f0f0" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#9da1a7", letterSpacing: "0.08em", margin: "0 0 20px", fontFamily: "'Google Sans', sans-serif" }}>FLOW</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[
                      { num: "1", title: "Write or generate", body: "Start with the content. Type freely or let Davy draft something based on a short prompt — tags help guide the tone and category." },
                      { num: "2", title: "Configure delivery", body: "Choose which channels to use, preview exactly what residents will see, and optionally shorten the SMS to fit 160 characters." },
                      { num: "3", title: "Set & post", body: "Add metadata — publish date, tags, notification preferences — then post. Settings come last so they never slow down the writing." },
                    ].map(({ num, title: t, body }) => (
                      <div key={num} style={{ flex: 1, background: "#f9f9f9", borderRadius: 16, padding: "22px 22px 24px" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "#245b51", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: "'Google Sans', sans-serif", marginBottom: 12 }}>{num}</div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0b182c", margin: "0 0 6px", fontFamily: "'Google Sans', sans-serif" }}>{t}</p>
                        <p style={{ fontSize: 13, color: "#5f6369", margin: 0, lineHeight: 1.65, fontFamily: "'Google Sans', sans-serif" }}>{body}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Layout rationale */}
                <div style={{ padding: "36px 60px 48px" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#9da1a7", letterSpacing: "0.08em", margin: "0 0 14px", fontFamily: "'Google Sans', sans-serif" }}>LAYOUT</p>
                  <p style={{ fontSize: 15, color: "#5f6369", margin: 0, lineHeight: 1.8, fontFamily: "'Google Sans', sans-serif" }}>
                    The layout is intentionally split: a quiet editing canvas on the left and a live channel preview locked to the right — so you always see what residents will receive as you write. The dark forest green anchors primary actions without competing with content. Everything else sits on white with light strokes, keeping the focus on the notice itself. Rounded buttons and generous padding make the interface feel approachable, while structured section labels and consistent type sizes maintain clarity across a dense set of settings.
                  </p>
                </div>
              </>}

              {endModalTab === 1 && (
                <div style={{ padding: "44px 60px 56px", display: "flex", flexDirection: "column", gap: 48 }}>

                  {/* Typography */}
                  <div style={{ display: "flex", gap: 48 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#9da1a7", letterSpacing: "0.08em", margin: "0 0 10px", fontFamily: "'Google Sans', sans-serif" }}>TYPOGRAPHY</p>
                      <p style={{ fontSize: 17, fontWeight: 700, color: "#0b182c", margin: "0 0 10px", fontFamily: "'Google Sans', sans-serif" }}>Clarity first</p>
                      <p style={{ fontSize: 15, color: "#5f6369", margin: 0, lineHeight: 1.8, fontFamily: "'Google Sans', sans-serif" }}>I chose a neutral, highly legible typeface similar to Google Sans for its clarity, scalability, and strong performance across digital interfaces. The goal was to create a clean and approachable foundation that works well in a system context and is easy to adapt for different brands in a white-label setup.</p>
                    </div>
                    <div style={{ width: 200, flexShrink: 0 }}>
                      <p style={{ fontSize: 32, fontWeight: 700, color: "#0b182c", margin: "0 0 2px", fontFamily: "'Google Sans', sans-serif", lineHeight: 1.1 }}>Aa</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#0b182c", margin: "0 0 14px", fontFamily: "'Google Sans', sans-serif" }}>Google Sans</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {[
                          { size: "42px", weight: "Bold", label: "Title" },
                          { size: "16px", weight: "SemiBold", label: "Buttons" },
                          { size: "14px", weight: "Regular", label: "Body" },
                          { size: "13px", weight: "Medium", label: "Labels" },
                          { size: "11px", weight: "SemiBold", label: "Caps" },
                        ].map(({ size, weight, label }) => (
                          <div key={size} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                            <span style={{ fontSize: 12, color: "#0b182c", fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>{size} · {weight}</span>
                            <span style={{ fontSize: 11, color: "#9da1a7", fontFamily: "'Google Sans', sans-serif" }}>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 1, background: "#f0f0f0" }} />

                  {/* Colour */}
                  <div style={{ display: "flex", gap: 48 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#9da1a7", letterSpacing: "0.08em", margin: "0 0 10px", fontFamily: "'Google Sans', sans-serif" }}>COLOUR · Avy mode</p>
                      <p style={{ fontSize: 17, fontWeight: 700, color: "#0b182c", margin: "0 0 10px", fontFamily: "'Google Sans', sans-serif" }}>Higher contrast, modern feel</p>
                      <p style={{ fontSize: 15, color: "#5f6369", margin: "0 0 16px", lineHeight: 1.8, fontFamily: "'Google Sans', sans-serif" }}>The color palette is inspired by Avy's green and white tones. Away from the beige-heavy interface toward a cleaner, higher-contrast foundation that improves readability, accessibility, and creates a more modern and focused feel.</p>
                      <p style={{ fontSize: 13, color: "#9da1a7", margin: 0, lineHeight: 1.6, fontFamily: "'Google Sans', sans-serif" }}>The primary green and logo are already adaptable per brand — Stockholmshem and Balder demonstrate this in the demo.</p>
                    </div>
                    <div style={{ width: 200, flexShrink: 0 }}>
                      {/* Always show Avy palette regardless of active demo theme */}
                      <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #ececec" }}>
                        <div style={{ background: "#245b51", padding: "18px 16px 16px" }}>
                          <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.55)", margin: "0 0 3px", fontFamily: "'Google Sans', sans-serif", letterSpacing: "0.07em" }}>PRIMARY GREEN</p>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0, fontFamily: "'Google Sans', sans-serif" }}>#245b51</p>
                        </div>
                        <div style={{ background: "#0b182c", padding: "14px 16px" }}>
                          <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", margin: "0 0 3px", fontFamily: "'Google Sans', sans-serif", letterSpacing: "0.07em" }}>TEXT PRIMARY</p>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0, fontFamily: "'Google Sans', sans-serif" }}>#0b182c</p>
                        </div>
                        <div style={{ display: "flex", borderTop: "1px solid #ececec" }}>
                          <div style={{ flex: 1, background: "#5f6369", padding: "12px 14px" }}>
                            <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.55)", margin: "0 0 2px", fontFamily: "'Google Sans', sans-serif", letterSpacing: "0.06em" }}>TEXT SECONDARY</p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "white", margin: 0, fontFamily: "'Google Sans', sans-serif" }}>#5f6369</p>
                          </div>
                          <div style={{ flex: 1, background: "#ededed", padding: "12px 14px", borderLeft: "1px solid #ddd" }}>
                            <p style={{ fontSize: 10, fontWeight: 600, color: "#9da1a7", margin: "0 0 2px", fontFamily: "'Google Sans', sans-serif", letterSpacing: "0.06em" }}>STROKE</p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#5f6369", margin: 0, fontFamily: "'Google Sans', sans-serif" }}>#ededed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ height: 1, background: "#f0f0f0" }} />

                  {/* Brand flexibility */}
                  <div style={{ display: "flex", gap: 48 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#9da1a7", letterSpacing: "0.08em", margin: "0 0 10px", fontFamily: "'Google Sans', sans-serif" }}>BRAND FLEXIBILITY</p>
                      <p style={{ fontSize: 17, fontWeight: 700, color: "#0b182c", margin: "0 0 10px", fontFamily: "'Google Sans', sans-serif" }}>Intentionally restrained</p>
                      <p style={{ fontSize: 15, color: "#5f6369", margin: 0, lineHeight: 1.8, fontFamily: "'Google Sans', sans-serif" }}>The UI is intentionally subtle and restrained to allow brands to layer their own identity on top. In a full brand expression (e.g. marketing surfaces), I would introduce more personality through bolder typography for headings and potentially explore more expressive typefaces, such as serif styles, to create stronger character and differentiation.</p>
                    </div>
                    <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { label: "Card radius", value: "24px" },
                        { label: "Button radius", value: "9999px" },
                        { label: "Base unit", value: "8px grid" },
                        { label: "Content pad", value: "32px" },
                        { label: "Section gap", value: "24px" },
                        { label: "Input radius", value: "10–16px" },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: "#5f6369", fontFamily: "'Google Sans', sans-serif" }}>{label}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#0b182c", fontFamily: "'Google Sans', sans-serif" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "20px 60px", borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => { setShowEndModal(false); resetState(); setShowStartModal(true); setEndModalTab(0); }}
                style={{ height: 40, padding: "0 24px", borderRadius: 9999, background: "none", color: "#9da1a7", fontSize: 14, fontWeight: 500, fontFamily: "'Google Sans', sans-serif", cursor: "pointer", border: "none" }}
              >
                ← Go back to start
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
