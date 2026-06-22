import { apiFetch, removeUserData, setAuthToken, setUserData } from "./api";

export const login = async (username, password) => {
  const response = await apiFetch('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })

  if (response.token) {
    setAuthToken(response.token)
    setUserData(response.user)
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
