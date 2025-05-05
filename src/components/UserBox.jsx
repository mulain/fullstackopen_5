// local
import loginService from '../services/login'

const UserBox = ({ user, setUser, notify }) => {
  const handleLogout = () => {
    loginService.logout()
    setUser(null)
    notify('Logged out successfully', 'success')
  }

  return (
    <div>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default UserBox
