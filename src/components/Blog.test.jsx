// external
import { render, screen } from '@testing-library/react'
import { describe, expect, test, beforeEach, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

// local
import Blog from './Blog'

describe('Blog', () => {
  let blog, user, onLike, onDelete

  beforeEach(() => {
    blog = {
      title: 'Test Blog',
      author: 'Author',
      url: 'https://example.com',
      likes: 0,
      user: {
        id: 1,
        name: 'testUser',
      },
    }

    user = {
      id: 1,
      name: 'testUser',
    }

    onLike = vi.fn()
    onDelete = vi.fn()

    render(<Blog blog={blog} user={user} onLike={onLike} onDelete={onDelete} />)
  })

  test('Unexpanded <Blog /> renders title and author, not other elements', () => {
    expect(screen.getByText('Test Blog')).toBeInTheDocument()
    expect(screen.getByText('by Author')).toBeInTheDocument()

    expect(screen.queryByText('https://example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('likes: 0')).not.toBeInTheDocument()
    expect(screen.queryByText('added by testUser')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^like$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^delete$/i })
    ).not.toBeInTheDocument()
  })

  test('Expanded <Blog /> renders all elements', async () => {
    await userEvent.click(screen.getByRole('button', { name: /test blog/i }))

    expect(screen.getByText('Test Blog')).toBeInTheDocument()
    expect(screen.getByText('by Author')).toBeInTheDocument()
    expect(screen.getByText('https://example.com')).toBeInTheDocument()
    expect(screen.getByText('likes: 0')).toBeInTheDocument()
    expect(screen.getByText('added by testUser')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^like$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^delete$/i })
    ).toBeInTheDocument()
  })

  test('Clicking like button twice calls onLike twice', async () => {
    await userEvent.click(screen.getByRole('button', { name: /test blog/i }))
    const likeButton = screen.getByRole('button', { name: /^like$/i })

    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(onLike).toHaveBeenCalledTimes(2)
  })

  test('Clicking delete button calls onDelete', async () => {
    await userEvent.click(screen.getByRole('button', { name: /test blog/i }))
    const deleteButton = screen.getByRole('button', { name: /^delete$/i })

    await userEvent.click(deleteButton)

    expect(onDelete).toHaveBeenCalledTimes(1)
  })
})
