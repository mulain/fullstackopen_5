// external
import { useState } from 'react'

const Blog = ({ blog }) => {
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
  }

  return (
    <div style={blogStyle} className="blog" onClick={toggleDetails}>
      <div>
            <strong>{blog.title}</strong> by {blog.author}
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            {`likes: ${blog.likes}`}
            <button type="button" onClick={handleLikeClick}>
              like
            </button>
          </p>

          <p>{`added by ${blog.user.name}`}</p>
        </div>
      )}
    </div>
  )
}

export default Blog
