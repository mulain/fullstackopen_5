// external
import { useState } from 'react'
import PropTypes from 'prop-types'

// local
import loginService from '../services/login'

const LoginForm = ({ setUser, notify }) => {
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
      notify(`Welcome ${user.name}`, 'success')
    } catch (exception) {
      notify('Wrong username or password', 'error')
    }
  }

  return (
    <form id="login-form" onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
}

export default LoginForm
