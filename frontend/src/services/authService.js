// 
// Napisao Ivan Majer 2023/0406
//
import { apiFetch, removeUserData, setAuthToken, setUserData } from "./api";

export const login = async (username, password) => {
  const response = await apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })

  
    console.log("RESPONSE TOKEN", response);
  if (response.token) {
    
    setAuthToken(response.token)
    //setUserData(response.user)
  }

  return response
}

export const logout = async (token) => {
  const response = await apiFetch('/auth/logout/', {
    method: 'POST',
    body: JSON.stringify({ token })
  })

  if (response) {
    removeUserData()
  }
  return response
}

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
