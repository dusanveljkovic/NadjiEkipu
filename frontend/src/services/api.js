//
// Napisao Dusan Veljkovic 23/0417
//

const BASE_API_URL = 'http://127.0.0.1:8000/api'

// Dohvati token iz local storage
export const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

// Postavi token u local storage
export const setAuthToken = (token) => {
  
  
  if (token){
    localStorage.setItem('auth_token', token)
  }
  else
    localStorage.removeItem('auth_token')
}

// Dohvati podatke o korisniku preko servera koristeci jwt
export async function getUserData() {
  const token = getAuthToken();

  if (!token)
    return null;
  
  const response = await apiFetch('/user-data/', {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return response;
}

// Postavi podatke o korisniku u local storage
export const setUserData = (user) => {
  localStorage.setItem('user_data', JSON.stringify(user))
}

// Izbrisi sve podatke iz local storage
export const removeUserData = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
}

// Pozovi api
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
