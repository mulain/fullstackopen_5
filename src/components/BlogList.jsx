// external
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'

// local
import blogService from '../services/blogs'
import Blog from './Blog'

const BlogList = forwardRef(({ user, notify }, ref) => {
  const [blogs, setBlogs] = useState([])

  const fetchAndSetBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  useEffect(() => {
    fetchAndSetBlogs()
  }, [])

  useImperativeHandle(ref, () => {
    return {
      fetchAndSetBlogs,
    }
  })

  const handleLike = async (blogToLike) => {
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
    }

    try {
      const returnedBlog = await blogService.update(blogToLike.id, updatedBlog)

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === returnedBlog.id ? updatedBlog : blog
        )
      )

      notify(
        `You liked "${returnedBlog.title}" by ${returnedBlog.author}`,
        'success'
      )
    } catch (error) {
      const message = error.response?.data?.error || 'Error updating blog'
      notify(message, 'error')
    }
  }

  const handleDelete = async (blogToDelete) => {
    if (
      window.confirm(
        `Remove blog "${blogToDelete.title}" by ${blogToDelete.author}`
      )
    ) {
      try {
        await blogService.remove(blogToDelete.id)
        setBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog.id !== blogToDelete.id)
        )
        notify(`Blog "${blogToDelete.title}" deleted`, 'success')
      } catch (error) {
        const message = error.response?.data?.error || 'Error deleting blog'
        notify(message, 'error')
      }
    }
  }

  const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)

  return (
    <>
      <h2>Blogs</h2>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      ))}
    </>
  )
})

BlogList.displayName = 'BlogList'

export default BlogList
