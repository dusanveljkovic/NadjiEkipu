// 
// Napisao Ivan Majer 2023/0406
//
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addInterest } from "../services/interestService";
import { getIcons } from "../services/utils";

export default function AddInterest() {
  /**
   * Dodavanje interesovanja od strane moderatora
   * Dodaje se ikona interesovanja, naziv, opis
   */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");

  const navigate = useNavigate();

  const icons = getIcons();

  const handleCancel = (e) => {
    e.preventDefault();

    navigate("/my-interests");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = {
        name: name,
        description: description,
        avatar_id: Number(selectedIcon)
      };
      await addInterest(form);
      navigate("/my-interests");
    } catch (err) {
      console.error(err);
    }
    navigate("/my-interests");
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>

      <h1 style={{ fontSize: 22, marginBottom: 20, fontWeight: 500 }}>
        Dodaj interesovanje
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        <div>
          <label style={{ fontSize: 14 }}>Ikonica:  </label>

          <select
            value={selectedIcon}
            onChange={(e) => setSelectedIcon(e.target.value)}
          >
            <option value="">Izaberi ikonicu</option>

            {Object.entries(icons).map(([id, emoji]) => (
              <option key={id} value={id}>
                {emoji}
              </option>
            ))}
          </select>

          {selectedIcon && (
            <div style={{ fontSize: 50 }}>
              {icons[selectedIcon]}
            </div>
          )}
        </div>

        {/* Naziv */}
        <div>
          <label style={{ fontSize: 14 }}>Naziv interesovanja</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="npr. Fotografija"
            style={{
              marginTop: 6,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100%"
            }}
          />
        </div>

        {/* Opis */}
        <div>
          <label style={{ fontSize: 14 }}>Opis interesovanja</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kratak opis interesovanja..."
            rows={4}
            style={{
              marginTop: 6,
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100%",
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />
        </div>

        {/* Dugmad */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button"
            style={{
              padding: "9px 20px",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
              background: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "inherit",
              color: "#1a1a18",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f5f5f5";
              e.currentTarget.style.borderColor = "#ccc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = "#e0e0e0";
            }}
            onClick={handleCancel}>
            Otkaži
          </button>

          <button
            type="submit"
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
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4338A4";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#534AB7";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Sačuvaj
          </button>
        </div>

      </form>
    </div>
  );
}
