import { useState, useEffect } from "react";

const ACCENT = "#534AB7";
const ACCENT_LIGHT = "#EEEDFE";
const ACCENT_DARK = "#3F3A8C";
const SOFT = "#F6F4FF";

export default function CreateActivity({ onCreate, onBack }) {
  const [form, setForm] = useState({
    hobby: "",
    date: "",
    time: "",
    location: "",
    locationType: "indoor", 
    max: "",
    description: "",
  });

  const [focused, setFocused] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetch(`http://127.0.0.1:8000/api/users/1`)
        .then((res) => {
          if (!res.ok) throw new Error("Greška pri učitavanju korisnika");
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }, []);
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400 text-sm">Učitavanje profila...</p>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      );
    }
  

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLocationTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      locationType: type,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.hobby || !form.date || !form.time || !form.location || !form.max ) {
      alert("Popuni sva obavezna polja");
      return;
    }

    const eventTime = `${form.date}T${form.time}:00`;

    const body = {
      interest_id: 1, 
      created_by: user.idusers,
      title: form.hobby,
      description: form.description,
      event_time: eventTime,
      location_name: form.location,
      max_participants: parseInt(form.max),
      indoor: form.locationType === "indoor" ? 1 : 0,
      lat: null,
      lon: null,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/activities/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Greška prilikom kreiranja aktivnosti");
        return;
      }
      alert("Aktivnost uspešno kreirana!");
      if (onCreate) {
        onCreate(data);
      }
      onBack();
    } catch (err) {
      console.error(err);
      alert("Greška pri povezivanju sa serverom");
    }
  };

  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 4,
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: ACCENT_LIGHT,
            borderRadius: 10,
            padding: "6px 14px",
            cursor: "pointer",
            color: ACCENT,
            fontSize: 13,
            fontWeight: 500,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = ACCENT;
            e.currentTarget.style.color = "white";
            e.currentTarget.style.transform = "translateX(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = ACCENT_LIGHT;
            e.currentTarget.style.color = ACCENT;
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <span>←</span> <span>Nazad</span>
        </button>

        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: ACCENT_DARK }}>
            ✨ Nova aktivnost
          </h1>
          <p style={{ fontSize: 11, color: "#9ca3a0", margin: "2px 0 0" }}>
            Kreiraj događaj i pozovi prijatelje
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          borderRadius: 24,
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          border: "1px solid #f0f0f0",
          boxShadow: "0 20px 40px rgba(83,74,183,0.1)",
        }}
      >
        {/* Hobby */}
        <Input
          label="🏆 Hobi"
          name="hobby"
          value={form.hobby}
          onChange={handleChange}
          placeholder="Npr. Košarka, Fudbal, Planinarenje..."
          focused={focused === "hobby"}
          onFocus={() => setFocused("hobby")}
          onBlur={() => setFocused(null)}
        />

        {/* Date + Time */}
        <div style={{ display: "flex", gap: 16 }}>
          <Input
            type="date"
            label="📅 Datum"
            name="date"
            value={form.date}
            onChange={handleChange}
            focused={focused === "date"}
            onFocus={() => setFocused("date")}
            onBlur={() => setFocused(null)}
          />
          <Input
            type="time"
            label="⏰ Vreme"
            name="time"
            value={form.time}
            onChange={handleChange}
            focused={focused === "time"}
            onFocus={() => setFocused("time")}
            onBlur={() => setFocused(null)}
          />
        </div>

        {/* Location */}
        <Input
          label="📍 Lokacija (adresa/mesto)"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Npr. Beograd, Novi Sad..."
          focused={focused === "location"}
          onFocus={() => setFocused("location")}
          onBlur={() => setFocused(null)}
        />

        {/* Location Type - Indoor/Outdoor */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background: SOFT,
            padding: "14px 16px",
            borderRadius: 16,
            border: `1.5px solid ${focused === "locationType" ? ACCENT : "transparent"}`,
            transition: "all 0.2s ease",
          }}
          onFocus={() => setFocused("locationType")}
          onBlur={() => setFocused(null)}
        >
          <label style={{ fontSize: 12, color: ACCENT, fontWeight: 500 }}>
            🌍 Tip lokacije
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={() => handleLocationTypeChange("indoor")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 12,
                border: `1.5px solid ${form.locationType === "indoor" ? ACCENT : "#e0e0e0"}`,
                background: form.locationType === "indoor" ? ACCENT_LIGHT : "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s ease",
                color: form.locationType === "indoor" ? ACCENT : "#666",
                fontWeight: form.locationType === "indoor" ? 600 : 400,
              }}
            >
              <span style={{ fontSize: 18 }}>🏠</span>
              <span>Unutra</span>
            </button>
            <button
              type="button"
              onClick={() => handleLocationTypeChange("outdoor")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 12,
                border: `1.5px solid ${form.locationType === "outdoor" ? ACCENT : "#e0e0e0"}`,
                background: form.locationType === "outdoor" ? ACCENT_LIGHT : "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s ease",
                color: form.locationType === "outdoor" ? ACCENT : "#666",
                fontWeight: form.locationType === "outdoor" ? 600 : 400,
              }}
            >
              <span style={{ fontSize: 18 }}>🌳</span>
              <span>Napolju</span>
            </button>
          </div>
        </div>

        {/* Max */}
        <Input
          type="number"
          label="👥 Max učesnika"
          name="max"
          value={form.max}
          onChange={handleChange}
          placeholder="Npr. 10"
          focused={focused === "max"}
          onFocus={() => setFocused("max")}
          onBlur={() => setFocused(null)}
        />

        {/* Description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            background: focused === "description" ? "white" : SOFT,
            padding: "14px 16px",
            borderRadius: 16,
            border: `1.5px solid ${focused === "description" ? ACCENT : "transparent"}`,
            transition: "all 0.2s ease",
            boxShadow: focused === "description" ? `0 0 0 3px ${ACCENT}20` : "none",
          }}
        >
          <label style={{ fontSize: 12, color: ACCENT, fontWeight: 500 }}>
            📝 Opis aktivnosti
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            onFocus={() => setFocused("description")}
            onBlur={() => setFocused(null)}
            rows={3}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              resize: "vertical",
              fontFamily: "inherit",
              color: "#1a1a18",
              lineHeight: 1.5,
            }}
            placeholder="Dodaj opis aktivnosti, šta je planirano, šta poneti..."
          />
          <div style={{ fontSize: 10, color: "#9ca3a0", marginTop: 4 }}>
            {form.description.length} karaktera
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button
            type="button"
            onClick={onBack}
            style={secondaryBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = ACCENT;
              e.currentTarget.style.color = ACCENT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.color = "#666";
            }}
          >
            Otkaži
          </button>

          <button
            type="submit"
            style={primaryBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = ACCENT_DARK;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(83,74,183,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = ACCENT;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(83,74,183,0.3)";
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          >
            🚀 Kreiraj aktivnost
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= INPUT ================= */

function Input({ label, focused, onFocus, onBlur, ...props }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: focused ? "white" : SOFT,
        padding: "12px 16px",
        borderRadius: 16,
        border: `1.5px solid ${focused ? ACCENT : "transparent"}`,
        transition: "all 0.2s ease",
        boxShadow: focused ? `0 0 0 3px ${ACCENT}20` : "none",
      }}
    >
      <label style={{ fontSize: 12, color: ACCENT, fontWeight: 500 }}>
        {label}
      </label>
      <input
        {...props}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 14,
          padding: "4px 0",
          color: "#1a1a18",
        }}
      />
      {props.type === "date" && props.value && (
        <div style={{ fontSize: 10, color: "#9ca3a0", marginTop: 4 }}>
          {new Date(props.value).toLocaleDateString("sr-RS")}
        </div>
      )}
    </div>
  );
}

/* ================= BUTTONS ================= */

const primaryBtn = {
  flex: 1,
  padding: "14px",
  borderRadius: 14,
  border: "none",
  background: ACCENT,
  color: "white",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(83,74,183,0.3)",
  transition: "all 0.2s ease",
};

const secondaryBtn = {
  flex: 1,
  padding: "14px",
  borderRadius: 14,
  border: "1.5px solid #e0e0e0",
  background: "white",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: 14,
  color: "#666",
  transition: "all 0.2s ease",
};