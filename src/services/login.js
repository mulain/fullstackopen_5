import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  if (response.status !== 200) {
    throw new Error('Invalid credentials')
  }
  const user = response.data
  localStorage.setItem('loggedInUser', JSON.stringify(user))

  setAuthHeader(user.token)

  return user
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
