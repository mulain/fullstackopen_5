// external
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const baseUrl = '/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  if (response.status !== 200) {
    throw new Error('Invalid credentials')
  }
  const user = response.data
  user.id = getUserIdFromToken(user.token)

  localStorage.setItem('loggedInUser', JSON.stringify(user))
  setAuthHeader(user.token)

  return user
}

const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token)
    return decoded.id
  } catch (error) {
    console.error('Error decoding token', error)
    return null
  }
}

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

const logout = () => {
  localStorage.removeItem('loggedInUser')
  delete axios.defaults.headers.common['Authorization']
}

export default { login, logout, setAuthHeader }
