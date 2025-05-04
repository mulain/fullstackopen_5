// external
import { useState, useEffect } from 'react'

// local
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import UserBox from './components/UserBox'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const fetchAndSetBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchAndSetBlogs()
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      loginService.setAuthHeader(user.token)
    }
  }, [])

  return (
    <>
      <Notification notification={notification} />

      {!user ? (
        <LoginForm setUser={setUser} setNotification={setNotification} />
      ) : (
        <>
          <h2>BlogService</h2>
          <UserBox
            user={user}
            setUser={setUser}
            setNotification={setNotification}
          />
          <CreateBlogForm setNotification={setNotification} />
          <BlogList blogs={blogs} />
        </>
      )}
    </>
  )
}

export default App
