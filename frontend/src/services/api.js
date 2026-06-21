// Author: Dusan Veljkovic 23/0417

const BASE_API_URL = 'http://127.0.0.1:8000/api'

const getAuthToken = () => {
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

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken()
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
