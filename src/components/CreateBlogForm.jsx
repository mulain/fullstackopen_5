// external
import { useState } from 'react'

// local
import blogService from '../services/blogs'

const CreateBlogForm = ({ setNotification }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title,
        author,
        url,
      }
      const result = await blogService.create(newBlog)
      setNotification({
        message: `New blog "${result.title}" by ${result.author} added`,
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 2000)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      const errorMessage =
        exception.response?.data?.error || 'Error creating blog'
      setNotification({
        message: errorMessage,
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Blog</h2>

      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          required
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        <label htmlFor="url">URL:</label>
        <input
          type="text"
          id="url"
          name="url"
          required
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlogForm
