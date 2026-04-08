import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function Registration() {
    const navigate = useNavigate();

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword){
            alert("Passwordi se ne poklapaju");
            return;
        }

        console.log("Registrovan korisnik:", form);


        navigate("/login");
    }

    const handleCancel = () => {
        navigate("/login");
    }

    const years = [];
    for (let i = 2020; i >= 1950; i--) {
        years.push(i);
    }

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
            <h2>Registracija</h2>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label>
                    <input className="inputFields" name="email" type="email" onChange={handleChange} required/>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Ime:</label>
                    <input className="inputFields" name="ime" type="text" onChange={handleChange} required />
                </div>

                <div style={{marginBottom: "10px"}}>
                    <label>Prezime:</label>
                    <input className="inputFields" name="prezime" type="text" onChange={handleChange} required />
                </div>

                <div style={{marginBottom: "10px"}}>
                    <label>Godiste:</label>
                    <select name="godiste" onChange={handleChange} required>
                        <option value="">Izaberi godinu</option>
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{marginBottom: "10px"}}>
                    <label>Username:</label>
                    <input  className="inputFields" name="username" onChange={handleChange} required/>
                </div>

                <div style={{marginBottom: "10px"}}>
                    <label>Password:</label>
                    <input className="inputFields" name="password" type="password" onChange={handleChange} required/>
                </div>

                <div style={{marginBottom: "10px"}}>
                    <label>Confirm Password:</label>
                    <input className="inputFields" name="confirmPassword" type="password" onChange={handleChange} required/>
                </div>

                <div style={{display: "flex", gap: "10px"}}>
                    <button type="submit">Registruj se</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>

    );
}

export default Registration;