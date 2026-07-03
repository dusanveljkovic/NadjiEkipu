//
// Napisao Dusan Veljkovic 2023/0417
//
import { useState, useMemo, useEffect } from "react";
import FillBar from "../components/FillBar"
import { getInterests } from "../services/interestService";
import { getActivities, getJoinedActivities, joinActivity, leaveActivity } from "../services/activityService"
import { getRandomColor } from "../services/utils"
import { getUserData } from "../services/api";

function extractCities(activities) {
  return [...new Set(activities.map(a => a.location_name))]
}

function Home() {
  const [search, setSearch] = useState("")
  const [selectedInterests, setSelectedInterests] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [page, setPage] = useState(1)
  const [showJoined, setShowJoined] = useState(true)

  const [activites, setActivites] = useState([])
  const [interests, setInterests] = useState([])
  const [cities, setCities] = useState([])
  const [joinedActivities, setJoinedActivities] = useState([])
  const [joiningId, setJoiningId] = useState(null)
  const [error, setError] = useState(null)

  const user = getUserData()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    let data = await getInterests()
    setInterests(data)

    data = await getActivities()
    setActivites(data)
    setCities(extractCities(data))

    data = await getJoinedActivities()
    setJoinedActivities(data)
  }


  const isJoined = a => {
    return joinedActivities.some(ja => ja.idactivities === a.idactivities)
  }

  const filteredInterests = interests.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  const filteredActivities = useMemo(() => {
    return activites.filter((a) => {
      let [date, time] = a.event_time.split('T')
      time = time.replace('Z', '')
      return (
        (!(a.created_by_id === user.idusers)) &&
        (selectedInterests.length === 0 || selectedInterests.includes(a.interest_name)) &&
        (!startDate || date >= startDate) &&
        (!endDate || date <= endDate) &&
        (!startTime || time >= startTime) &&
        (!endTime || time <= endTime) &&
        (!location || a.location_name === location) &&
        ((!showJoined && !isJoined(a)) || showJoined)
      )
    })
  }, [activites, selectedInterests, startDate, endDate, startTime, endTime, location, showJoined])

  const PAGE_SIZE = 5
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageSlice = filteredActivities.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleActivity = async (a) => {
    if (isJoined(a))
      leaveActivity(a.idactivities)
    else
      joinActivity(a.idactivities)
    await loadData()
  }

  const handleSelectedInterest = (interest) => {
    if (selectedInterests.includes(interest))
      setSelectedInterests(selectedInterests.filter(x => x !== interest))
    else
      setSelectedInterests([...selectedInterests, interest])

    console.log(Array.isArray(selectedInterests))
    console.log(selectedInterests)
  }
  const toggleInterest = (interest) => {
    setPage(1);
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((x) => x !== interest) : [...prev, interest]
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
              <i className="fa-solid fa-magnifying-glass"
                style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                placeholder="Pretrazi interesovanja..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ ...inputStyle, paddingLeft: 32 }}
              />
            </div>

            {filteredInterests.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {filteredInterests.map((interest) => {
                  const active = selectedInterests.includes(interest.name);
                  return (
                    <button
                      key={interest.name}
                      onClick={() => toggleInterest(interest.name)}
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
                      {interest.name}
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
              <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 6, flex: "1 1 160px" }}>
              <input type="time" value={startTime} onChange={(e) => { setStartTime(e.target.value); setPage(1); }} style={inputStyle} />
              <input type="time" value={endTime} onChange={(e) => { setEndTime(e.target.value); setPage(1); }} style={inputStyle} />
            </div>
            <select
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              style={{ ...inputStyle, flex: "0 1 160px", cursor: "pointer" }}
            >
              <option value="">Sve lokacije</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input type="checkbox" id="showJoined" checked={showJoined} onChange={(e) => setShowJoined(e.target.checked)}
              style={{ cursor: "pointer", accentColor: "#534AB7" }} />
            <label htmlFor="showJoined" style={{ fontSize: 14, color: "#1a1a18", cursor: "pointer" }}>Prikazi pridruzene aktivnosti</label>
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
              const { bg, color } = getRandomColor(a.interest_name);
              const full = a.num_participants >= a.max_participants;
              const isJ = isJoined(a)
              return (
                <div
                  key={a.idactivities}
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
                    {a.interest_name.slice(0, 3).toUpperCase()}
                  </div>

                  {/* Name */}
                  <div style={{ flex: "0 0 140px", minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#1a1a18", margin: 0 }}>{a.title}</p>
                  </div>

                  {/* Date & time */}
                  <div style={{ flex: "0 0 100px", display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 12, color: "#1a1a18" }}>{a.event_time.split('T')[0]}</span>
                    <span style={{ fontSize: 11, color: "#9ca3a0" }}>{a.event_time.split('T')[1].replace('Z', '')}</span>
                  </div>

                  {/* Location */}
                  <div style={{ flex: "0 0 100px", display: "flex", alignItems: "center", gap: 5 }}>
                    <i className="fa-solid fa-location-pin" />
                    <span style={{ fontSize: 12, color: "#6b6b67" }}>{a.location_name}</span>
                  </div>

                  {/* Fill bar */}
                  <div style={{ flex: 1 }}>
                    <FillBar signed={a.num_participants} max={a.max_participants} useFull={true} />
                  </div>

                  {/* Join button */}
                  <button
                    onClick={() => !full && toggleActivity(a)}
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
                      background: (full || isJ) ? (full ? "rgba(0,0,0,0.06)" : "#fd0000") : "#534AB7",
                      color: full ? "#9ca3a0" : "white",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!full) e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    {(full || isJ) ? (full ? "Popunjeno" : "Ispisi se") : "Pridruzi se"}
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
