import { useState, useRef } from "react";

const HOBBY_COLORS = [
  { bg: "#EEEDFE", color: "#534AB7", border: "#AFA9EC" },
  { bg: "#E1F5EE", color: "#0F6E56", border: "#5DCAA5" },
  { bg: "#FAECE7", color: "#993C1D", border: "#F0997B" },
  { bg: "#E6F1FB", color: "#185FA5", border: "#85B7EB" },
  { bg: "#FBEAF0", color: "#993556", border: "#ED93B1" },
  { bg: "#FAEEDA", color: "#854F0B", border: "#EF9F27" },
  { bg: "#EAF3DE", color: "#3B6D11", border: "#97C459" },
  { bg: "#FCEBEB", color: "#A32D2D", border: "#F09595" },
];

function getColor(id) {
  return HOBBY_COLORS[(id - 1) % HOBBY_COLORS.length];
}

function SkillBar({ level, onChange, color }) {
  const trackRef = useRef(null);

  const calcLevel = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.max(1, Math.round(pct * 10));
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (onChange) onChange(calcLevel(e.clientX));
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    if (!onChange) return;
    const move = (ev) => onChange(calcLevel(ev.clientX));
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color, fontWeight: 600 }}>{level}/10</span>
      </div>
      <div
        ref={trackRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        style={{
          position: "relative",
          height: 8,
          borderRadius: 99,
          background: "rgba(0,0,0,0.1)",
          cursor: onChange ? "pointer" : "default",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${(level || 0) * 10}%`,
            borderRadius: 99,
            background: color,
            transition: "width 0.12s ease",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${(level || 0) * 10}%`,
            transform: "translate(-50%, -50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "white",
            border: `2px solid ${color}`,
            boxShadow: `0 1px 4px ${color}44`,
            transition: "left 0.12s ease",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

export default function MojeInteresovanjeKartica({ 
  item, 
  onRemove, 
  onSave 
}) {
  // Zaštita ako item nije definisan
  if (!item) {
    return null;
  }

  const { bg, color, border } = getColor(item.id);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSkill, setTempSkill] = useState(item.skill || 5);
  
  const currentSkill = isEditing ? tempSkill : (item.skill || 5);

  const handleSave = () => {
    if (onSave && item.id) {
      onSave(item.id, tempSkill);
    }
    setIsEditing(false);
  };

  const handleRemove = () => {
    if (onRemove && item.id) {
      onRemove(item.id);
    }
  };

  return (
    <div
      style={{
        background: bg,
        border: `1.5px solid ${border}`,
        borderRadius: 14,
        padding: "18px",
        boxShadow: `0 4px 16px ${color}22`,
        transition: "all 0.18s ease",
        position: "relative",
      }}
    >
      {/* Desni cosak - X i olovka */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
          zIndex: 10,
        }}
      >
        {/* Olovka / Save dugme */}
        {isEditing ? (
          <button
            onClick={handleSave}
            title="Sačuvaj promene"
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: color,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            title="Izmeni nivo veštine"
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.06)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.12)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path
                d="M8.5 1.5L10.5 3.5M2 8.5L3 7.5L8 2.5L9.5 4L4.5 9L3.5 10L1.5 10.5L2 8.5Z"
                stroke={color}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        )}

        {/* X dugme - uklanjanje interesovanja */}
        <button
          onClick={handleRemove}
          title="Ukloni interesovanje"
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.06)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.12)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.06)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 2l6 6M8 2l-6 6"
              stroke="#666"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Ikona i naziv */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          {item.icon || "🎯"}
        </div>
        <div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: color,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {item.name || "Nepoznato"}
          </p>
          {item.count !== undefined && (
            <p
              style={{
                fontSize: 11,
                color: "#9ca3a0",
                margin: 0,
                marginTop: 3,
              }}
            >
              {item.count} aktivnosti
            </p>
          )}
        </div>
      </div>

      {/* Skill bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}
      >
        <p style={{ fontSize: 11, color, fontWeight: 500, margin: 0 }}>
          Nivo veštine
        </p>
        <SkillBar
          level={currentSkill}
          onChange={isEditing ? setTempSkill : undefined}
          color={color}
        />
      </div>
    </div>
  );
}