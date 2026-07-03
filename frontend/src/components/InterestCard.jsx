//
// Napisala Jana Jolovic 2023/0338
//
import { useRef } from "react";
import { getRandomColor, formatCount, getInterestAvatar } from "../services/utils.js"

function SkillBar({ level, onChange, color }) {
  const trackRef = useRef(null);

  const calcLevel = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.max(1, Math.round(pct * 10));
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onChange(calcLevel(e.clientX));
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    const move = (ev) => onChange(calcLevel(ev.clientX));
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
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
          cursor: "pointer",
        }}
      >
        {/* Filled portion */}
        <div
          style={{
            position: "absolute",
            left: 0, top: 0, bottom: 0,
            width: `${level * 10}%`,
            borderRadius: 99,
            background: color,
            transition: "width 0.12s ease",
          }}
        />
        {/* Thumb */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${level * 10}%`,
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

function InterestCard({ interest, selected, skill, onToggle, onSkillChange }) {
  const { bg, color } = getRandomColor(interest.name)
  const border = color

  return (
    <div
      onClick={() => { if (!selected) onToggle(interest.idinterests) }}
      style={{
        background: selected ? bg : "white",
        border: selected ? `1.5px solid ${border}` : "0.5px solid rgba(0,0,0,0.1)",
        borderRadius: 14,
        padding: "18px 18px 16px",
        flexDirection: "column",
        gap: 12,
        boxShadow: selected
          ? `0 4px 16px ${color}22`
          : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "all 0.18s ease",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Selected checkmark */}
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* X remove button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(interest.idinterests); }}
            title="Ukloni interesovanje"
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.08)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              flexShrink: 0,
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.08)"; }}
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M2 2l6 6M8 2l-6 6" stroke="#1a1a18" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* Icon + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: selected ? `${color}18` : "#f5f5f3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {getInterestAvatar(interest)}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: selected ? color : "#1a1a18", margin: 0, lineHeight: 1.3 }}>
            {interest.name}
          </p>
          <p style={{ fontSize: 11, color: "#9ca3a0", margin: 0, marginTop: 2 }}>
            {interest.members !== undefined ? formatCount(interest.members) + " članova" : ""}
          </p>
        </div>
      </div>

      {/* Skill picker — only when selected */}
      {selected && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ display: "flex", flexDirection: "column", gap: 6 }}
        >
          <p style={{ fontSize: 11, color, fontWeight: 500, margin: 0 }}>Nivo veštine</p>
          <SkillBar level={skill} onChange={(v) => onSkillChange(interest.iduser_interests, v)} color={color} />
        </div>
      )}

    </div>
  );
}

export default InterestCard
