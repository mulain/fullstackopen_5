// local
import loginService from '../services/login'

const UserBox = ({ user, setUser, setNotification }) => {
  const handleLogout = () => {
    loginService.logout()
    setUser(null)
    setNotification({
      message: 'Logged out successfully',
      type: 'success',
    })
    setTimeout(() => {
      setNotification(null)
    }, 2000)
  }

  return (
    <div>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default UserBox
