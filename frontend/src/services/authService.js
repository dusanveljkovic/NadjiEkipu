// 
// Napisao Ivan Majer 2023/0406
//
import { apiFetch, removeUserData, setAuthToken, setUserData } from "./api";

//login korisnika na sistem
export const login = async (username, password) => {
  const response = await apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })

  
    console.log("RESPONSE TOKEN", response);
  if (response.token) {
    
    setAuthToken(response.token)
  }

  return response
}

export const logout = async () => {
  removeUserData();
}

//registruje korisnika u sistem
export const register = async (formData) => {
  try {
    const data = await apiFetch("/auth/register/", {
      method: "POST",
      body: JSON.stringify(formData)
    });

    return data;
  } catch (err) {
    throw new Error(err.message || "Registration failed");
  }
};
