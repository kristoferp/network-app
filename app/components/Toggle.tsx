"use client";
import { useState } from "react";

type Tab = { id: string; label: string; dot?: boolean };

const TABS: Tab[] = [
  { id: "email", label: "Email" },
  { id: "sms",   label: "SMS",   dot: true },
  { id: "board", label: "Board", dot: true },
];

export default function Toggle() {
  const [active, setActive] = useState("email");

  return (
    <div
      className="flex items-center gap-1 w-full"
      style={{ padding: "4px 4px 0 4px" }}
    >
      {TABS.map(({ id, label, dot }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="flex flex-1 items-center justify-center gap-[3px] min-w-0 overflow-hidden"
            style={{
              padding: "7px 24px",
              borderBottom: isActive
                ? "2px solid #0b182c"
                : "2px solid transparent",
              borderRadius: 100,
              cursor: "pointer",
              background: "transparent",
              boxShadow: isActive
                ? "0px 1px 1px rgba(16,24,40,0.05)"
                : undefined,
              transition: "border-color 0.15s",
            }}
          >
            <span
              style={{
                fontFamily: "'Google Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "20px",
                letterSpacing: 0,
                color: "#0b182c",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
            {dot && !isActive && (
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#0073f1",
                  flexShrink: 0,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
