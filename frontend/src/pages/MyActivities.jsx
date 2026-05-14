import { useState } from "react";
import FillBar from "../components/FillBar"
import CreateActivity from "./CreateActivity";

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

function getColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return HOBBY_COLORS[Math.abs(hash) % HOBBY_COLORS.length];
}

const INITIAL_ACTIVITIES = [
  { id: 1, hobby: "Košarka",      date: "2026-04-20", time: "18:00", location: "Novi Sad",  signed: 8,  max: 10, description: "Tigar zove na košarku. DOLAZI !!!" },
  { id: 2, hobby: "Fotografija", date: "2026-04-25", time: "10:00", location: "Beograd",   signed: 3,  max: 6,  description: "" },
  { id: 3, hobby: "Učenje",      date: "2026-05-01", time: "09:00", location: "Novi Sad",  signed: 12, max: 20, description: "Učenje OS-a sa Janom :)" },
];

function formatDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  const months = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"];
  return `${parseInt(day)}. ${months[parseInt(m) - 1]} ${y}`;
}

function DeleteModal({ activity, onConfirm, onCancel }) {
  const { color, bg } = getColor(activity.hobby);
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: 16,
          padding: "28px 28px 24px",
          width: "100%", maxWidth: 380,
          border: "0.5px solid rgba(0,0,0,0.1)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FCEBEB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#1a1a18", margin: 0 }}>Obriši aktivnost</p>
            <p style={{ fontSize: 12, color: "#9ca3a0", margin: 0, marginTop: 2 }}>Ova akcija se ne može poništiti</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#6b6b67", marginBottom: 24, lineHeight: 1.6 }}>
          Da li si siguran/na da želiš da obrišeš aktivnost{" "}
          <strong style={{ color: "#1a1a18" }}>{activity.hobby}</strong> zakazanu za{" "}
          <strong style={{ color: "#1a1a18" }}>{formatDate(activity.date)}</strong>?
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: 500,
              fontFamily: "inherit", cursor: "pointer",
              border: "0.5px solid rgba(0,0,0,0.15)", background: "white", color: "#1a1a18",
            }}
          >
            Otkaži
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: 500,
              fontFamily: "inherit", cursor: "pointer",
              border: "none", background: "#A32D2D", color: "white",
            }}
          >
            Obriši
          </button>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity, onDelete }) {
  const { bg, color, border } = getColor(activity.hobby);
  const isPast = activity.date < new Date().toISOString().slice(0, 10);

  return (
    <div style={{
      background: "white",
      border: "0.5px solid rgba(0,0,0,0.1)",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      opacity: isPast ? 0.6 : 1,
      transition: "opacity 0.15s",
    }}>
      {/* Colored top stripe */}
      <div style={{ height: 4, background: color }} />

      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color, flexShrink: 0 }}>
              {activity.hobby.slice(0, 3).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 500, color: "#1a1a18", margin: 0 }}>{activity.hobby}</p>
              {isPast && (
                <span style={{ fontSize: 10, fontWeight: 500, color: "#9ca3a0", background: "#f5f5f3", borderRadius: 99, padding: "2px 7px", display: "inline-block", marginTop: 3 }}>
                  Završena
                </span>
              )}
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={() => onDelete(activity)}
            style={{
              width: 32, height: 32, borderRadius: 8, border: "0.5px solid rgba(0,0,0,0.12)",
              background: "white", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.12s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#FCEBEB"; e.currentTarget.style.borderColor = "#F09595"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; }}
            title="Obriši aktivnost"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>

        {/* Meta info */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={{ fontSize: 12, color: "#6b6b67" }}>{formatDate(activity.date)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{ fontSize: 12, color: "#6b6b67" }}>{activity.time}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ fontSize: 12, color: "#6b6b67" }}>{activity.location}</span>
          </div>
        </div>

        {/* Description */}
        {activity.description && (
          <p style={{ fontSize: 12.5, color: "#6b6b67", margin: 0, lineHeight: 1.6, borderLeft: `2px solid ${border}`, paddingLeft: 10 }}>
            {activity.description}
          </p>
        )}

        {/* Fill bar */}
        <FillBar signed={activity.signed} max={activity.max} color={color} />
      </div>
    </div>
  );
}

export default function MyActivities() {

  const [activities, setActivities]     = useState(INITIAL_ACTIVITIES);
  const [page, setPage]                 = useState("list");      // "list" | "create"
  const [toDelete, setToDelete]         = useState(null);

  const handleCreate = (newActivity) => {
    setActivities((prev) => [newActivity, ...prev]);
    setPage("list");
  };

  const handleDelete = () => {
    setActivities((prev) => prev.filter((a) => a.id !== toDelete.id));
    setToDelete(null);
  };

  const upcoming = activities.filter((a) => a.date >= new Date().toISOString().slice(0, 10));
  const past     = activities.filter((a) => a.date <  new Date().toISOString().slice(0, 10));

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f3", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", padding: "32px 16px" }}>

      {toDelete && (
        <DeleteModal
          activity={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      {page === "create" ? (
        <CreateActivity onCreate={handleCreate} onBack={() => setPage("list")} />
      ) : (
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 500, color: "#1a1a18", margin: 0 }}>Moje aktivnosti</h1>
              <p style={{ fontSize: 12, color: "#9ca3a0", marginTop: 4 }}>
                {upcoming.length} predstojeć{upcoming.length === 1 ? "a" : "ih"} &middot; {past.length} završen{past.length === 1 ? "a" : "ih"}
              </p>
            </div>
            <button
              onClick={() => setPage("create")}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                fontFamily: "inherit", cursor: "pointer", border: "none",
                background: "#534AB7", color: "white",
                boxShadow: "0 4px 14px #534AB733",
                flexShrink: 0,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Nova aktivnost
            </button>
          </div>

          {/* Empty state */}
          {activities.length === 0 && (
            <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 14, padding: "56px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
              <p style={{ fontSize: 15, fontWeight: 500, color: "#1a1a18", margin: 0 }}>Nemaš aktivnosti</p>
              <p style={{ fontSize: 13, color: "#9ca3a0", marginTop: 6, marginBottom: 20 }}>Kreiraj prvu aktivnost i pozovi druge!</p>
              <button
                onClick={() => setPage("create")}
                style={{ padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, fontFamily: "inherit", cursor: "pointer", border: "none", background: "#534AB7", color: "white" }}
              >
                Kreiraj aktivnost
              </button>
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#9ca3a0", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                Predstojeće — {upcoming.length}
              </p>
              {upcoming.map((a) => (
                <ActivityCard key={a.id} activity={a} onDelete={setToDelete} />
              ))}
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "#9ca3a0", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                Završene — {past.length}
              </p>
              {past.map((a) => (
                <ActivityCard key={a.id} activity={a} onDelete={setToDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
