// external
import { test, expect } from '@playwright/test'

// local
import {
  backendReset,
  createUser,
  createBlog,
  loginUI,
  logoutUI,
  goToBlog,
  clickBlog,
  getBlogEntry,
  makeBlogData,
  clickAndLikeBlog,
} from './testUtils'

test.describe('Login element visibility', () => {
  test.beforeEach(async ({ page }) => {
    await goToBlog(page)
  })

  test('Login button is shown', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'login' })
    await expect(loginButton).toBeVisible()
  })

  test('Login form is shown on Login button Click', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'login' })
    await loginButton.click()
    const loginForm = page.locator('form#login-form')
    await expect(loginForm).toBeVisible()
  })
})

test.describe('Login', () => {
  test.beforeEach(async ({ page, request }) => {
    await backendReset(request)
    await createUser(request)
  })

  test('Login succeeds with correct credentials', async ({ page }) => {
    await loginUI(page)

    const welcomeText = page.getByText('Lukas logged in')
    await expect(welcomeText).toBeVisible()
  })

  test('Login fails with wrong credentials', async ({ page }) => {
    await loginUI(page, 'lukasdj', 'wrongpassword')

    const errorMessage = page.getByText('Wrong username or password')
    await expect(errorMessage).toBeVisible()
  })
})

test.describe('Blog', () => {
  test.beforeEach(async ({ page, request }) => {
    await backendReset(request)
    await createUser(request)
    await loginUI(page)
  })

  test('A new blog can be created', async ({ page }) => {
    const { title, author, url } = makeBlogData()
    await createBlog(page, { title, author, url })
    const newBlogEntry = page.getByText(getBlogEntry(title, author))
    await expect(newBlogEntry).toBeVisible()
  })

  test('A blog can be liked', async ({ page }) => {
    const { title, author, url } = makeBlogData()
    await createBlog(page, { title, author, url })
 
    await clickAndLikeBlog(page, { title, author, url }, 1)
    const likeCount = page.getByText(/likes:\s*1/)
    await expect(likeCount).toBeVisible()
  })

  test('A blog can be deleted', async ({ page }) => {
    const { title, author, url } = makeBlogData()
    await createBlog(page, { title, author, url })
    await clickBlog(page, getBlogEntry(title, author))

    const deleteButton = page.getByRole('button', {
      name: 'delete',
      exact: true,
    })

    page.once('dialog', (dialog) => dialog.accept())
    await deleteButton.click()

    await page.waitForSelector(`text=${getBlogEntry(title, author)}`, {
      state: 'detached',
    })
  })

  test('Delete button is not shown for other users', async ({
    page,
    request,
  }) => {
    const { title, author, url } = makeBlogData()
    await createBlog(page, { title, author, url })
    await logoutUI(page)
    await createUser(request, 'otheruser', 'otheruser', 'otherpassword')
    await loginUI(page, 'otheruser', 'otherpassword')
    await clickBlog(page, getBlogEntry(title, author))

    const deleteButton = page.getByRole('button', {
      name: 'delete',
      exact: true,
    })
    await expect(deleteButton).not.toBeVisible()
  })

  test('Blogs are ordered by likes', async ({ page }) => {
    test.setTimeout(10_000)
    const blogs = [makeBlogData('A'), makeBlogData('B'), makeBlogData('C')]

    for (const blog of blogs) {
      await createBlog(page, blog)
    }

    await clickAndLikeBlog(page, blogs[0], 2)
    await clickAndLikeBlog(page, blogs[1], 5)
    await clickAndLikeBlog(page, blogs[2], 3)

    const blogEntries = await page.locator('.blog').allTextContents()

    const expectedOrder = [blogs[1], blogs[2], blogs[0]]
    expectedOrder.forEach((blog, index) => {
      expect(blogEntries[index]).toContain(getBlogEntry(blog.title, blog.author))
    })
  })
})
