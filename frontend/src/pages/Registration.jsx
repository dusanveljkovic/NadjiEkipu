import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "../services/authService";
import "../App.css";

function Registration() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordR, setShowPasswordR] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form, setform] = useState({
        email: "",
        ime: "",
        prezime: "",
        godiste: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    
    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Lozinke se ne poklapaju");
                return;
            }

        setLoading(true);

        try {
            const data = await register(form);

            console.log("Uspešna registracija:", data);

            navigate("/login");
        } catch (err) {
            console.log("Greška:", err.message);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        navigate("/login");
    }

    const years = [];
    for (let i = 2020; i >= 1950; i--) {
        years.push(i);
    }

    

    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginTop: "5px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        outline: "none",
        boxSizing: "border-box"
    };

    const iconButton = {
        position: "absolute",
        right: "10px",
        top: "35px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#666"
    };

    const primaryButton = {
        flex: 1,
        backgroundColor: "#2563eb",
        color: "white",
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    };

    const secondaryButton = {
        flex: 1,
        backgroundColor: "transparent",
        color: "#2563eb",
        padding: "10px",
        border: "1px solid #2563eb",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    };

    return (
        <div
            style={{
            maxWidth: "420px",
            margin: "60px auto",
            padding: "30px",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            fontFamily: "Arial, sans-serif"
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Registracija
            </h2>

            <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "14px" }}>Email:</label>
                <input
                className="inputFields"
                name="email"
                type="email"
                onChange={handleChange}
                required
                style={inputStyle}
                />
            </div>

            <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "14px" }}>Ime:</label>
                <input
                className="inputFields"
                name="ime"
                type="text"
                onChange={handleChange}
                required
                style={inputStyle}
                />
            </div>

            <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "14px" }}>Prezime:</label>
                <input
                className="inputFields"
                name="prezime"
                type="text"
                onChange={handleChange}
                required
                style={inputStyle}
                />
            </div>

            <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "14px" }}>Godište:</label>
                <select
                name="godiste"
                onChange={handleChange}
                required
                style={inputStyle}
                >
                <option value="">Izaberi godinu</option>
                {years.map((y) => (
                    <option key={y} value={y}>
                    {y}
                    </option>
                ))}
                </select>
            </div>

            <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "14px" }}>Username:</label>
                <input
                className="inputFields"
                name="username"
                onChange={handleChange}
                required
                style={inputStyle}
                />
            </div>

            <div style={{ position: "relative", marginBottom: "12px" }}>
                <label style={{ fontSize: "14px" }}>Password:</label>

                <input
                type={showPassword ? "text" : "password"}
                className="inputFields"
                name="password"
                onChange={handleChange}
                required
                style={{ ...inputStyle, paddingRight: "40px" }}
                />

                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={iconButton}
                >
                {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
                </button>
            </div>

            <div style={{ position: "relative", marginBottom: "18px" }}>
                <label style={{ fontSize: "14px" }}>Confirm Password:</label>

                <input
                type={showPasswordR ? "text" : "password"}
                className="inputFields"
                name="confirmPassword"
                onChange={handleChange}
                required
                style={{ ...inputStyle, paddingRight: "40px" }}
                />

                <button
                type="button"
                onClick={() => setShowPasswordR(!showPasswordR)}
                style={iconButton}
                >
                {/* {showPasswordR ? <FaEyeSlash /> : <FaEye />} */}
                </button>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>

                <button
                type="submit"
                style={primaryButton}
                >
                Registruj se
                </button>

                <button
                type="button"
                onClick={handleCancel}
                style={secondaryButton}
                >
                Cancel
                </button>

            </div>
            </form>
        </div>
    );
}

export default Registration;