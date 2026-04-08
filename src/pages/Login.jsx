import { useState } from "react";
import { useNavigate } from "react-router-dom";

const users = [
  {
    username: "tigar",
    password: "admin"
  },
  {
    username: "dusan",
    password: "admin"
  }
]

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegistration = (e) => {
    navigate("/registration");
  }

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log("Username:", username);
    console.log("Password:", password);

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user){
      console.log("Login successful");
      navigate("/home");
    }
    else {
      console.log("Login failed");
      navigate("/");
    }
    // ovde ide API poziv
  };

  return (
    <div style={{ maxWidth: "300px", margin: "100px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
                border: "1px solid #ccc",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "4px",
                width: "100%",
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
                border: "1px solid #ccc",
                padding: "8px",
                marginTop: "4px",
                borderRadius: "4px",
                width: "100%",
                boxSizing: "border-box"
            }}
          />
        </div>
            <div style={{display: "flex", gap: "20px"}}>
             <button type="submit">Uloguj se</button>
             <button type="button" onClick={handleRegistration}>Registruj se</button>
        </div>
      </form>
    </div>
  );
}

export default Login;