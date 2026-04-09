import {useState, useMemo} from "react";

const hobbies = [
  "Fudbal",
  "Kosarka",
  "Kuvanje",
  "Fotografija",
  "Voznja bicikla",
  "Ucenje"
]

const cities = [
  "Beograd",
  "Novi Sad",
  "Niš",
  "Kragujevac",
  "Kraljevo",
  "Novi Pazar"
]

const mockActivities = [
  {
    id: 1,
    hobby: "Fudbal",
    date: "2026-04-10",
    time: "18:00",
    location: "Novi Sad",
    signed: 8,
    max: 10,
  },
  {
    id: 2,
    hobby: "Sah",
    date: "2026-04-10",
    time: "20:00",
    location: "Beograd",
    signed: 3,
    max: 6,
  },
  {
    id: 3,
    hobby: "Ucenje",
    date: "2026-04-11",
    time: "09:00",
    location: "Beograd",
    signed: 5,
    max: 8,
  },
]

const HOBBY_COLORS = [
  { bg: "#EEEDFE", color: "#534AB7" },
  { bg: "#E1F5EE", color: "#0F6E56" },
  { bg: "#FAECE7", color: "#993C1D" },
  { bg: "#E6F1FB", color: "#185FA5" },
  { bg: "#FBEAF0", color: "#993556" },
  { bg: "#FAEEDA", color: "#854F0B" },
  { bg: "#EAF3DE", color: "#3B6D11" },
  { bg: "#FCEBEB", color: "#A32D2D" },
];
 
function hobbyColor(hobby) {
  let hash = 0;
  for (let i = 0; i < hobby.length; i++) hash = hobby.charCodeAt(i) + ((hash << 5) - hash);
  return HOBBY_COLORS[Math.abs(hash) % HOBBY_COLORS.length];
}

function FillBar({ signed, max }) {
  const pct = Math.round((signed / max) * 100);
  const full = pct >= 90;
  const mid  = pct >= 60;
  const barColor = full ? "#A32D2D" : mid ? "#854F0B" : "#534AB7";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 80 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b6b67" }}>
        <span>{signed}/{max}</span>
        <span style={{ color: barColor, fontWeight: 500 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 99, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: barColor, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}
function Home() {
  const [search, setSearch] = useState("")
  const [selectedHobbies, setSelectedHobbies] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [activites, setActivites] = useState(mockActivities)
  const [page, setPage] = useState(1)


  const filteredHobbies = hobbies.filter(h => h.toLowerCase().includes(search.toLowerCase()))

  const filteredActivities = useMemo(() => {
    return activites.filter((a) => {
      return (
        (selectedHobbies.length === 0 || selectedHobbies.includes(a.hobby)) &&
        (!startDate || a.date >= startDate) && 
        (!endDate || a.date <= endDate) && 
        (!startTime || a.time >= startTime) && 
        (!endTime || a.time <= endTime) && 
        (!location || a.location === location)
      )
    })
  }, [activites, selectedHobbies, startDate, endDate, startTime, endTime, location])

  const PAGE_SIZE = 5
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageSlice  = filteredActivities.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const joinActivity = (id) => {}

  const handleSelectedHobby = (hobby => {
    if(selectedHobbies.includes(hobby))
      setSelectedHobbies(selectedHobbies.filter(x => x !== hobby))
    else {
      setSelectedHobbies([...selectedHobbies, hobby])
    }
    console.log(Array.isArray(selectedHobbies))
    console.log(selectedHobbies)
  })
  const toggleHobby = (hobby) => {
    setPage(1);
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((x) => x !== hobby) : [...prev, hobby]
    );
  };

  const inputStyle = {
    width: "100%",
    border: "0.5px solid rgba(0,0,0,0.18)",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#1a1a18",
    background: "#f5f5f3",
    outline: "none",
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f3",
        fontFamily: "",
        padding: "32px 16px",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
 
        {/* Page title */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, color: "#1a1a18", margin: 0 }}>Aktivnosti</h1>
          <p style={{ fontSize: 12, color: "#9ca3a0", marginTop: 4 }}>
            {filteredActivities.length} {filteredActivities.length === 1 ? "rezultat" : "rezultata"}
          </p>
        </div>
 
        {/* Filter card */}
        <div
          style={{
            background: "white",
            border: "0.5px solid rgba(0,0,0,0.1)",
            borderRadius: 12,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          {/* Search + hobby chips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#9ca3a0" strokeWidth="2"
                style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }}
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Pretrazi interesovanja..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ ...inputStyle, paddingLeft: 32 }}
              />
            </div>
 
            {filteredHobbies.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {filteredHobbies.map((hobby) => {
                  const active = selectedHobbies.includes(hobby);
                  return (
                    <button
                      key={hobby}
                      onClick={() => toggleHobby(hobby)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 99,
                        fontSize: 12,
                        fontWeight: active ? 500 : 400,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        border: active ? "none" : "0.5px solid rgba(0,0,0,0.15)",
                        background: active ? "#534AB7" : "transparent",
                        color: active ? "white" : "#6b6b67",
                        transition: "all 0.15s",
                      }}
                    >
                      {hobby}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
 
          {/* Date / time / city row */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 6, flex: "1 1 220px" }}>
              <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} style={inputStyle} />
              <input type="date" value={endDate}   onChange={(e) => { setEndDate(e.target.value);   setPage(1); }} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 6, flex: "1 1 160px" }}>
              <input type="time" value={startTime} onChange={(e) => { setStartTime(e.target.value); setPage(1); }} style={inputStyle} />
              <input type="time" value={endTime}   onChange={(e) => { setEndTime(e.target.value);   setPage(1); }} style={inputStyle} />
            </div>
            <select
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              style={{ ...inputStyle, flex: "0 1 160px", cursor: "pointer" }}
            >
              <option value="">Svi gradovi</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
 
        {/* Activity list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pageSlice.length === 0 ? (
            <div
              style={{
                background: "white",
                border: "0.5px solid rgba(0,0,0,0.1)",
                borderRadius: 12,
                padding: "40px 20px",
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
              <p style={{ fontSize: 14, color: "#6b6b67", margin: 0 }}>Nema aktivnosti koje odgovaraju filterima</p>
              <p style={{ fontSize: 12, color: "#9ca3a0", marginTop: 4 }}>Pokušaj da promeniš pretragu ili filtere</p>
            </div>
          ) : (
            pageSlice.map((a) => {
              const { bg, color } = hobbyColor(a.hobby);
              const full = a.signed >= a.max;
              return (
                <div
                  key={a.id}
                  style={{
                    background: "white",
                    border: "0.5px solid rgba(0,0,0,0.1)",
                    borderRadius: 12,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    transition: "box-shadow 0.15s",
                  }}
                >
                  {/* Hobby badge */}
                  <div
                    style={{
                      width: 42, height: 42, borderRadius: "50%",
                      background: bg, color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 500, flexShrink: 0,
                      textAlign: "center", lineHeight: 1.2,
                    }}
                  >
                    {a.hobby.slice(0, 3).toUpperCase()}
                  </div>
 
                  {/* Name */}
                  <div style={{ flex: "0 0 140px", minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18", margin: 0 }}>{a.hobby}</p>
                  </div>
 
                  {/* Date & time */}
                  <div style={{ flex: "0 0 100px", display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 12, color: "#1a1a18" }}>{a.date}</span>
                    <span style={{ fontSize: 11, color: "#9ca3a0" }}>{a.time}</span>
                  </div>
 
                  {/* Location */}
                  <div style={{ flex: "0 0 100px", display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3a0" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span style={{ fontSize: 12, color: "#6b6b67" }}>{a.location}</span>
                  </div>
 
                  {/* Fill bar */}
                  <div style={{ flex: 1 }}>
                    <FillBar signed={a.signed} max={a.max} />
                  </div>
 
                  {/* Join button */}
                  <button
                    onClick={() => !full && joinActivity(a.id)}
                    disabled={full}
                    style={{
                      flexShrink: 0,
                      padding: "7px 16px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: "inherit",
                      cursor: full ? "not-allowed" : "pointer",
                      border: "none",
                      background: full ? "rgba(0,0,0,0.06)" : "#534AB7",
                      color: full ? "#9ca3a0" : "white",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!full) e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    {full ? "Popunjeno" : "Pridruži se"}
                  </button>
                </div>
              );
            })
          )}
        </div>
 
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 4 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              style={{
                width: 32, height: 32, borderRadius: 8, border: "0.5px solid rgba(0,0,0,0.15)",
                background: "white", cursor: safePage === 1 ? "not-allowed" : "pointer",
                color: safePage === 1 ? "#9ca3a0" : "#1a1a18", fontSize: 14, fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: n === safePage ? "none" : "0.5px solid rgba(0,0,0,0.15)",
                  background: n === safePage ? "#534AB7" : "white",
                  color: n === safePage ? "white" : "#1a1a18",
                  fontSize: 12, fontWeight: n === safePage ? 500 : 400,
                  fontFamily: "inherit", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              style={{
                width: 32, height: 32, borderRadius: 8, border: "0.5px solid rgba(0,0,0,0.15)",
                background: "white", cursor: safePage === totalPages ? "not-allowed" : "pointer",
                color: safePage === totalPages ? "#9ca3a0" : "#1a1a18", fontSize: 14, fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
