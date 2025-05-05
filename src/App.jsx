// external
import { useState, useEffect, useRef } from 'react'

// local
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import UserBox from './components/UserBox'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const toggleCreateBlogFormRef = useRef()
  const toggleLoginFormRef = useRef()

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

  const notify = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  return (
    <>
      <Notification notification={notification} />

      {!user ? (
        <Togglable
          buttonLabelShow="Login"
          buttonLabelHide="Cancel"
          ref={toggleLoginFormRef}
        >
          <LoginForm setUser={setUser} notify={notify} />
        </Togglable>
      ) : (
        <>
          <h2>BlogService</h2>
          <UserBox user={user} setUser={setUser} notify={notify} />
          <Togglable
            buttonLabelShow="Create new blog"
            buttonLabelHide="Cancel"
            ref={toggleCreateBlogFormRef}
          >
            <CreateBlogForm
              notify={notify}
              onSuccess={() =>
                toggleCreateBlogFormRef.current.toggleVisibility()
              }
            />
          </Togglable>
          <BlogList blogs={blogs} />
        </>
      )}
    </>
  )
}

export default App
