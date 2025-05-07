// external
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi, beforeEach } from 'vitest'

// local
import CreateBlogForm from './CreateBlogForm'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

describe('<CreateBlogForm />', () => {
  const mockNotify = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('calls notify and onSuccess with correct data on successful creation', async () => {
    const fakeNewBlog = {
      title: 'Cool Title',
      author: 'Cool Author',
      url: 'https://cool.url',
    }

    blogService.create.mockResolvedValue({
      ...fakeNewBlog,
      id: 'abc123',
      likes: 0,
      user: 'user-id-1',
    })

    render(<CreateBlogForm notify={mockNotify} onSuccess={mockOnSuccess} />)

    await userEvent.type(screen.getByLabelText(/title/i), fakeNewBlog.title)
    await userEvent.type(screen.getByLabelText(/author/i), fakeNewBlog.author)
    await userEvent.type(screen.getByLabelText(/url/i), fakeNewBlog.url)
    await userEvent.click(screen.getByRole('button', { name: /create/i }))

    expect(blogService.create).toHaveBeenCalledWith(fakeNewBlog)

    expect(mockNotify).toHaveBeenCalledWith(
      `New blog "${fakeNewBlog.title}" by ${fakeNewBlog.author} added`,
      'success'
    )

    expect(mockOnSuccess).toHaveBeenCalled()
  })
})
