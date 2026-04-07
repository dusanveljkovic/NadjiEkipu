import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    const loginSuccess = true;

    if (loginSuccess){
        navigate("/");
    }
    // ovde ide API poziv
  };

  return (
    <div style={{ maxWidth: "300px", margin: "100px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
                border: "1px solid #ccc",   // okvir
                padding: "8px",             // unutrašnji razmak
                marginTop: "4px",           // razmak od labele
                borderRadius: "4px",        // malo zaobljeno
                width: "100%",              // da bude full width
                boxSizing: "border-box"
            }}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
                border: "1px solid #ccc",   // okvir
                padding: "8px",             // unutrašnji razmak
                marginTop: "4px",           // razmak od labele
                borderRadius: "4px",        // malo zaobljeno
                width: "100%",              // da bude full width
                boxSizing: "border-box"
            }}
          />
        </div>

        <button type="submit">Uloguj se</button>
      </form>
    </div>
  );
}

export default Login;