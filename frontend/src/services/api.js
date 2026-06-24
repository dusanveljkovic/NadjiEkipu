// Author: Dusan Veljkovic 23/0417

const BASE_API_URL = 'http://127.0.0.1:8000/api'

export const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

export const setAuthToken = (token) => {
  if (token)
    localStorage.setItem('auth_token', token)
  else
    localStorage.removeItem('auth_token')
}

export const getUserData = () => {
  const userStr = localStorage.getItem('user_data')
  return userStr ? JSON.parse(userStr) : null
}

export const setUserData = (user) => {
  localStorage.setItem('user_data', JSON.stringify(user))
}

export const removeUserData = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
}

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken()
  console.log("api FEtch" , token);
  const defaultHeaders = {
    'Content-Type': 'application/json'
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  }

  try {
    console.log("TOKEN:", token);
    console.log("AUTH HEADER:", `Bearer ${token}`);

    console.log("TOKEN2", getAuthToken());
    const response = await fetch(`${BASE_API_URL}${endpoint}`, config)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error)
    }

    return data
  } catch (error) {
    console.error('API ERROR: ', error)
    throw error
  }
}

export default apiFetch
