import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddInterest() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(null);
  const [preview, setPreview] = useState(null);
  const [peopleCount, setPeopleCount] = useState(1);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIcon(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();

    console.log("Dodavanje interesovanja otkazano");
    navigate("/my-interests");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // ovde šalješ na backend
    console.log({
      name,
      icon,
      peopleCount,
    });
    navigate("/my-interests");
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      
      <h1 style={{ fontSize: 22, marginBottom: 20, fontWeight: 500}}>
        Dodaj interesovanje
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Upload ikone */}
        <div>
          <label style={{ fontSize: 14 }}>Ikonica</label>

          <div
            style={{
              marginTop: 6,
              border: "2px dashed #ccc",
              borderRadius: 10,
              padding: 20,
              textAlign: "center",
              cursor: "pointer"
            }}
          >
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {preview && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={preview}
                  alt="preview"
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                />
              </div>
            )}
          </div>
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