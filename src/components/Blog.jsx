// external
import { useState } from 'react'

const Blog = ({ blog, user, onLike, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    userSelect: 'none',
    cursor: 'pointer',
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLikeClick = async (event) => {
    event.stopPropagation()
    onLike(blog)
  }

  const handleDeleteClick = (event) => {
    event.stopPropagation()
    onDelete(blog)
  }

  return (
    <div
      style={blogStyle}
      className="blog"
      onClick={toggleDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          toggleDetails()
        }
      }}
    >
      <div>
        <strong>{blog.title}</strong> by {blog.author}
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes: {blog.likes}
            <button type="button" onClick={handleLikeClick}>
              like
            </button>
          </p>

          <p>{`added by ${blog.user.name}`}</p>
          {blog.user.id === user.id && (
            <button type="button" onClick={handleDeleteClick}>
              delete
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
