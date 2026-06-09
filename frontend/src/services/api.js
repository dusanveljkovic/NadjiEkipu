const BASE_API_URL = 'http://127.0.0.1:8000/api'

const apiFetch = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json'
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
