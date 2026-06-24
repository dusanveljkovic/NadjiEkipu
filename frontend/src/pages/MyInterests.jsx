import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInterests, getInterests, addUserInterest, deleteUserInterest, updateUserInterest } from "../services/interestService";
import InterestCard from "../components/InterestCard.jsx"
import { getUserData } from "../services/api.js";


export default function HobbiesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [allInterests, setAllInterests] = useState([])
  const [userInterests, setUserInterests] = useState([])
  const user = getUserData()

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
    navigate("/add-interest")
  };

  const toggleInterests = async (id) => {
    let found = userInterests.filter(ui => ui.idinterests === id)
    if (found.length != 0)
      await deleteUserInterest(found[0].iduser_interests)
    else
      await addUserInterest(id)
    loadUserInterests()
  };

  const setSkill = async (ui_id, level) => {
    await updateUserInterest(ui_id, level)
    loadUserInterests()
  };

  const filtered = allInterests.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))

  const notUserInterests =
    allInterests.filter(i => !userInterests.some(ui => ui.idinterests === i.idinterests))

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

            {user.role_id != 3 && <button
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
            </button>}
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
              {filtered.map(i => (
                <InterestCard
                  key={i.idinterests}
                  interest={i}
                  selected={false}
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
