// external
import { useState } from 'react'

// local
import blogService from '../services/blogs'

const CreateBlogForm = ({ notify, onSuccess }) => {
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
      notify(`New blog "${result.title}" by ${result.author} added`, 'success')
      setTitle('')
      setAuthor('')
      setUrl('')
      onSuccess()
    } catch (exception) {
      const errorMessage =
        exception.response?.data?.error || 'Error creating blog'
      notify(errorMessage, 'error')
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
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={author}
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
          value={url}
          required
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default CreateBlogForm
