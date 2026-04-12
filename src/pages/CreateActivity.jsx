import { useState } from "react";

const ACCENT = "#534AB7";
const SOFT = "#F6F4FF";

export default function CreateActivity({ onCreate, onBack }) {

  const [form, setForm] = useState({
    hobby: "",
    date: "",
    time: "",
    location: "",
    max: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.hobby || !form.date || !form.time || !form.location || !form.max) {
      alert("Popuni sva obavezna polja");
      return;
    }

    const newActivity = {
      id: Date.now(),
      hobby: form.hobby,
      date: form.date,
      time: form.time,
      location: form.location,
      signed: 0,
      max: parseInt(form.max),
      description: form.description,
    };

    onCreate(newActivity);
    onBack();
  };

  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: SOFT,
          padding: "14px 16px",
          borderRadius: 14,
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "white",
            borderRadius: 8,
            padding: "4px 8px",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          ←
        </button>

        <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: ACCENT }}>
          Nova aktivnost
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          borderRadius: 16,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          border: "1px solid #eee",
          boxShadow: "0 10px 30px rgba(83,74,183,0.08)",
        }}
      >
        {/* Hobby */}
        <Input label="Hobi" name="hobby" value={form.hobby} onChange={handleChange} placeholder="npr. Košarka" />

        {/* Date + Time */}
        <div style={{ display: "flex", gap: 12 }}>
          <Input type="date" label="Datum" name="date" value={form.date} onChange={handleChange} />
          <Input type="time" label="Vreme" name="time" value={form.time} onChange={handleChange} />
        </div>

        {/* Location */}
        <Input label="Lokacija" name="location" value={form.location} onChange={handleChange} placeholder="npr. Beograd" />

        {/* Max */}
        <Input type="number" label="Max učesnika" name="max" value={form.max} onChange={handleChange} placeholder="npr. 10" />

        {/* Description */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            background: SOFT,
            padding: "10px 12px",
            borderRadius: 12,
          }}
        >
          <label style={{ fontSize: 11, color: "#6b6b67" }}>Opis</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              resize: "none",
            }}
            placeholder="Dodaj opis aktivnosti..."
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button
            type="button"
            onClick={onBack}
            style={secondaryBtn}
          >
            Otkaži
          </button>

          <button
            type="submit"
            style={primaryBtn}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Kreiraj
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= INPUT ================= */

function Input({ label, ...props }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flex: 1,
        background: SOFT,
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid transparent",
        transition: "0.15s",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
      onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
    >
      <label style={{ fontSize: 11, color: "#6b6b67" }}>{label}</label>

      <input
        {...props}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 13,
        }}
      />
    </div>
  );
}

/* ================= BUTTONS ================= */

const primaryBtn = {
  flex: 1,
  padding: "11px",
  borderRadius: 12,
  border: "none",
  background: ACCENT,
  color: "white",
  fontWeight: 500,
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(83,74,183,0.3)",
  transition: "transform 0.1s",
};

const secondaryBtn = {
  flex: 1,
  padding: "11px",
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};