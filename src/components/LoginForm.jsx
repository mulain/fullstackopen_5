// external
import { useState } from 'react'

// local
import loginService from '../services/login'

const LoginForm = ({ setUser, setNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({
        message: `Welcome ${user.name}`,
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    } catch (exception) {
      setNotification({
        message: 'Wrong username or password',
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
