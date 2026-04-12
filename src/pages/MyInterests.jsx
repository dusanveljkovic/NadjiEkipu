import { useState, useMemo, useRef } from "react";

const ALL_HOBBIES = [
  { id: 1,  name: "Fudbal",          icon: "⚽", members: 1243 },
  { id: 2,  name: "Košarka",         icon: "🏀", members: 876  },
  { id: 3,  name: "Kuvanje",         icon: "🍳", members: 2104 },
  { id: 4,  name: "Fotografija",     icon: "📷", members: 654  },
  { id: 5,  name: "Vožnja bicikla",  icon: "🚴", members: 431  },
  { id: 6,  name: "Učenje",          icon: "📚", members: 988  },
];

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

function formatCount(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + "k" : String(n);
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
    onChange(calcLevel(e.clientX));
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    const move = (ev) => onChange(calcLevel(ev.clientX));
    const up   = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
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

function HobbyCard({ hobby, selected, skill, onToggle, onSkillChange }) {
  const { bg, color, border } = getColor(hobby.id);

  return (
    <div
      onClick={() => { if (!selected) onToggle(hobby.id)}}
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
          {/* Checkmark badge */}
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
 
          {/* X remove button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(hobby.id); }}
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
          {hobby.icon}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: selected ? color : "#1a1a18", margin: 0, lineHeight: 1.3 }}>
            {hobby.name}
          </p>
          <p style={{ fontSize: 11, color: "#9ca3a0", margin: 0, marginTop: 2 }}>
            {formatCount(hobby.members)} članova
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
          <SkillBar level={skill} onChange={(v) => onSkillChange(hobby.id, v)} color={color} />
        </div>
      )}

    </div>
  );
}

export default function HobbiesPage() {
  const [search, setSearch]         = useState("");
  const [userHobbies, setUserHobbies] = useState({});   // { hobbyId: skillLevel }

  const toggleHobby = (id) => {
    setUserHobbies((prev) => {
      if (prev[id] !== undefined) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: 5 };
    });
  };

  const setSkill = (id, level) => {
    setUserHobbies((prev) => ({ ...prev, [id]: level }));
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_HOBBIES.filter((h) => h.name.toLowerCase().includes(q));
  }, [search]);

  // Selected hobbies first, then the rest — both groups preserve original order
  const sorted = useMemo(() => {
    const selected = filtered.filter((h) => userHobbies[h.id] !== undefined);
    const rest     = filtered.filter((h) => userHobbies[h.id] === undefined);
    return [...selected, ...rest];
  }, [filtered, userHobbies]);

  const selectedCount = Object.keys(userHobbies).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f3",
        padding: "32px 16px",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 500, color: "#1a1a18", margin: 0 }}>Interesovanja</h1>
            <p style={{ fontSize: 12, color: "#9ca3a0", marginTop: 4 }}>
              {ALL_HOBBIES.length} interesovanja &middot; {selectedCount > 0 ? `${selectedCount} odabrano` : "nijedno nije odabrano"}
            </p>
          </div>
          {selectedCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#EEEDFE",
                border: "0.5px solid #AFA9EC",
                borderRadius: 99,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 500,
                color: "#534AB7",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="#534AB7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {selectedCount} odabrano
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#9ca3a0" strokeWidth="2"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Pretraži interesovanja..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              border: "0.5px solid rgba(0,0,0,0.18)",
              borderRadius: 10,
              padding: "10px 12px 10px 36px",
              fontSize: 13,
              fontFamily: "inherit",
              color: "#1a1a18",
              background: "white",
              outline: "none",
              boxSizing: "border-box",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          />
        </div>

        {/* Section label when selected hobbies exist */}
        {selectedCount > 0 && search === "" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#534AB7", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
                Moja interesovanja — {selectedCount}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {sorted
                  .filter((h) => userHobbies[h.id] !== undefined)
                  .map((hobby) => (
                    <HobbyCard
                      key={hobby.id}
                      hobby={hobby}
                      selected
                      skill={userHobbies[hobby.id]}
                      onToggle={toggleHobby}
                      onSkillChange={setSkill}
                    />
                  ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#9ca3a0", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
                Sva interesovanja
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {sorted
                  .filter((h) => userHobbies[h.id] === undefined)
                  .map((hobby) => (
                    <HobbyCard
                      key={hobby.id}
                      hobby={hobby}
                      selected={false}
                      skill={0}
                      onToggle={toggleHobby}
                      onSkillChange={setSkill}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Flat grid (searching or nothing selected) */}
        {(selectedCount === 0 || search !== "") && (
          sorted.length === 0 ? (
            <div
              style={{
                background: "white",
                border: "0.5px solid rgba(0,0,0,0.1)",
                borderRadius: 12,
                padding: "48px 20px",
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <p style={{ fontSize: 22, margin: "0 0 8px" }}>🔍</p>
              <p style={{ fontSize: 14, color: "#6b6b67", margin: 0 }}>Nema rezultata za "{search}"</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              {sorted.map((hobby) => (
                <HobbyCard
                  key={hobby.id}
                  hobby={hobby}
                  selected={userHobbies[hobby.id] !== undefined}
                  skill={userHobbies[hobby.id] ?? 0}
                  onToggle={toggleHobby}
                  onSkillChange={setSkill}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
