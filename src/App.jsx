// external
import { useState, useEffect, useRef } from 'react'

// local
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import UserBox from './components/UserBox'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './index.css'

const App = () => {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const toggleCreateBlogFormRef = useRef()
  const toggleLoginFormRef = useRef()
  const blogListRef = useRef()

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
              onSuccess={() => {
                blogListRef.current.fetchAndSetBlogs()
                toggleCreateBlogFormRef.current.toggleVisibility()
              }}
            />
          </Togglable>
          <BlogList user={user} notify={notify} ref={blogListRef} />
        </>
      )}
    </>
  )
}

export default App
