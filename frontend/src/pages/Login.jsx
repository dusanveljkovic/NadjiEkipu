//
// Napisao Ivan Majer 2023/0406
//
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  /**
   * Salje zahtev za prijavu korisnika
   * U slucaju uspeha prijavljuje korisnika u sistem, 
   * a u localStorage postavlja token generisan od servera
   */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate();

  const handleRegistration = (e) => {
    navigate("/registration");
  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true)

    try {
      console.log(username, password);
      setErrorMessage("");
      await login(username, password)
      navigate("/home");
    } catch (err) {
      setErrorMessage("Neispravno korisnicko ime ili lozinka");
      console.log("Login failed");
      navigate("/");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div
      style={{
        maxWidth: "360px",
        margin: "100px auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Login
      </h2>

      {errorMessage && (
        <div
        id="login-error-message"
          style={{
            color: "#d32f2f",
            background: "#fdecea",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "14px"
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ fontSize: "14px" }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "8px",
              width: "100%",
              outline: "none",
              transition: "0.2s"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "14px" }}>Password:</label>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "8px",
                width: "100%",
                paddingRight: "40px",
                outline: "none"
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#666"
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.2s"
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            {loading ? "Logovanje..." : "Uloguj se"}
          </button>

          <button
            type="button"
            onClick={handleRegistration}
            style={{
              backgroundColor: "transparent",
              color: "#2563eb",
              padding: "10px",
              border: "1px solid #2563eb",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.2s"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#eff6ff";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            Registruj se
          </button>

        </div>
      </form>
    </div>
  );
}

export default Login;
