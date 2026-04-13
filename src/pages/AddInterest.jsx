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
      
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>
        Dodaj interesovanje
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Upload ikone */}
        <div>
          <label style={{ fontSize: 14 }}>Ikona</label>

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

        {/* Br ljudi */}
        <div>
        <label style={{ fontSize: 14 }}>Broj ljudi</label>
        <input
            type="number"
            value={peopleCount}
            onChange={(e) => setPeopleCount(Number(e.target.value))}
            min={1}
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
          <button type="button" style={{ padding: "8px 12px", backgroundColor: "orange" }} onClick={handleCancel}>
            Otkaži
          </button>

          <button
            type="submit"
            style={{
              padding: "8px 12px",
              background: "#534AB7",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Sačuvaj
          </button>
        </div>

      </form>
    </div>
  );
}