import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomColor, formatCount } from "../services/utils";
import { getUserInterests, getInterests, addUserInterest, deleteUserInterest } from "../services/interestService";

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
          {interest.avatar_id}
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

export default function HobbiesPage() {
  const [search, setSearch] = useState("");
  const [allInterests, setAllInterests] = useState([])
  const [userInterests, setUserInterests] = useState([])

  useEffect(() => {
    loadUserInterests()
  }, [])

  const loadUserInterests = async () => {
    const data = await getUserInterests()
    setUserInterests(data)
  }

  useEffect(() => {
    getInterests()
      .then((data) => {
        setAllInterests(data)
      })
      .catch(() => { })
  }, [])

  const handleAddInterest = () => {
    useNavigate("/add-interest")
  };

  const toggleInterests = async (id) => {
    console.log(userInterests)
    console.log(id)
    let found = userInterests.filter(ui => ui.idinterests === id)
    console.log(found)
    if (found.length != 0)
      await deleteUserInterest(found[0].iduser_interests)
    else
      await addUserInterest(id)
    loadUserInterests()
  };

  const setSkill = (id, level) => {
    setUserInterests(prev =>
      prev.map(item => item.iduser_interests === id ? { ...item, skill_level: level } : item))
  };

  const filtered = allInterests.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))

  const notUserInterests = useMemo(() =>
    allInterests.filter(i => !userInterests.some(ui => ui.idinterests === i.idinterests)), [userInterests])

  const selectedCount = userInterests.length;
  console.log(filtered)

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
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}>
          {/* Levo - naslov i opis */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 500, color: "#1a1a18", margin: 0 }}>
              Interesovanja
            </h1>
            <p style={{ fontSize: 12, color: "#9ca3a0", margin: 0 }}>
              {allInterests.length} interesovanja &middot; {selectedCount > 0 ? `${selectedCount} odabrano` : "nijedno nije odabrano"}
            </p>
          </div>

          {/* Desno - badge pa dugme */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#534AB7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {selectedCount} odabrano
              </div>
            )}

            <button
              style={{
                padding: "9px 20px",
                borderRadius: "10px",
                border: "none",
                background: "#534AB7",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "inherit",
                color: "white",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
              onClick={handleAddInterest}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#4338A4";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#534AB7";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              + Dodaj interesovanje
            </button>
          </div>

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
                {userInterests
                  .map((ui) => (
                    <InterestCard
                      key={ui.idinterests}
                      interest={ui}
                      selected
                      skill={ui.skill_level}
                      onToggle={toggleInterests}
                      onSkillChange={setSkill}
                    />
                  ))}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#9ca3a0", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
                Ostala interesovanja
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                {notUserInterests
                  .map((i) => (
                    <InterestCard
                      key={i.idinterests}
                      interest={i}
                      selected={false}
                      onToggle={toggleInterests}
                      onSkillChange={setSkill}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Flat grid (searching or nothing selected) */}
        {(selectedCount === 0 || search !== "") && (
          filtered.length === 0 ? (
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
                  onToggle={toggleInterests}
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
