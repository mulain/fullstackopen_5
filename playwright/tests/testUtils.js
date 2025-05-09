// external
import { expect } from '@playwright/test'

const frontEndUrl = 'http://localhost:5173'
const backEndUrl = 'http://localhost:3003'

export async function goToBlog(page) {
  await page.goto(frontEndUrl)
}

const username = 'lukasdj'
const password = 'lukasdj123'
const name = 'Lukas'

export async function createUser(
  request,
  nameParam = name,
  usernameParam = username,
  passwordParam = password
) {
  await request.post(`${backEndUrl}/api/users`, {
    data: {
      name: nameParam,
      username: usernameParam,
      password: passwordParam,
    },
  })
}

export async function backendReset(request) {
  await request.post(`${backEndUrl}/api/testing/reset`)
}

export async function loginUI(
  page,
  usernameParam = username,
  passwordParam = password
) {
  await goToBlog(page)

  const loginButton = page.getByRole('button', { name: 'login' })
  await loginButton.click()

  const userNameInput = page.getByPlaceholder('Username')
  const passwordInput = page.getByPlaceholder('Password')
  const submitButton = page.getByRole('button', { name: 'login' })

  await userNameInput.fill(usernameParam)
  await passwordInput.fill(passwordParam)
  await submitButton.click()
}

export async function logoutUI(page) {
  const logoutButton = page.getByRole('button', { name: 'logout' })
  await logoutButton.click()
}

export async function clickBlog(page, blogEntry) {
  const expandButton = page.getByRole('button', {
    name: blogEntry,
  })
  await expandButton.click()
}

export async function createBlog(page, { title, author, url }) {
  await page.getByRole('button', { name: 'create' }).click()

  await page.getByPlaceholder('Title').fill(title)
  await page.getByPlaceholder('Author').fill(author)
  await page.getByPlaceholder('URL').fill(url)

  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.getByText(`${title} by ${author}`)).toBeVisible()
}

export function getBlogEntry(blogTitle, blogAuthor) {
  return `${blogTitle} by ${blogAuthor}`
}

export function makeBlogData(suffix = crypto.randomUUID().slice(0, 6)) {
  return {
    title: `Blog ${suffix}`,
    author: `Author ${suffix}`,
    url: `http://example.com/blog${suffix}`,
  }
}

export async function clickAndLikeBlog(page, blog, times = 1) {
  const entry = getBlogEntry(blog.title, blog.author)
  await clickBlog(page, entry)

  const blogContainer = page.locator('.blog', { hasText: entry })
  const likeButton = blogContainer.getByRole('button', {
    name: 'like',
    exact: true,
  })
  await expect(likeButton).toBeVisible()

  for (let i = 0; i < times; i++) {
    await likeButton.click()
    await page.waitForTimeout(100)

    const likeCountText = new RegExp(`likes:\\s*${i + 1}`)
    await expect(blogContainer.getByText(likeCountText)).toBeVisible()
  }
}
