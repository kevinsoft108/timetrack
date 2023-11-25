import axios from 'axios'

const API_URL = '/api/users/'

// Login admin
const adminLogin = async (userData) => {
  const response = await axios.post('/api/admin/login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

const authService = {
  logout,
  adminLogin
}

export default authService
