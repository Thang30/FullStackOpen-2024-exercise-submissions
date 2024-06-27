const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post('/api/testing/reset');
    console.log(`Database reset response status: ${resetResponse.status()}`);

    const userResponse1 = await request.post('/api/users', {
      data: {
        name: 'Test User 1',
        username: 'testuser1',
        password: 'testpassword1'
      }
    });
    console.log(`User creation response status (Test User 1): ${userResponse1.status()}`);

    const userResponse2 = await request.post('/api/users', {
      data: {
        name: 'Test User 2',
        username: 'testuser2',
        password: 'testpassword2'
      }
    });
    console.log(`User creation response status (Test User 2): ${userResponse2.status()}`);

    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await page.screenshot({ path: 'screenshots/page_loaded.png' });
    await page.click('text=log in');
    const loginHeader = page.getByText('Log in to application');
    await expect(loginHeader).toBeVisible();
    await page.screenshot({ path: 'screenshots/login_form_visible.png' });
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.click('text=log in');
      await page.fill('input[name="Username"]', 'testuser1');
      await page.fill('input[name="Password"]', 'testpassword1');
      await page.click('text=login');
      const logoutButton = page.getByText('logout');
      await expect(logoutButton).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.click('text=log in');
      await page.fill('input[name="Username"]', 'testuser1');
      await page.fill('input[name="Password"]', 'wrongpassword');
      await page.click('text=login');
      
      await page.screenshot({ path: 'screenshots/before_checking_error_message.png' });

      const errorMessage = page.getByText('Wrong credentials');
      await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173');
      await page.click('text=log in');
      await page.fill('input[name="Username"]', 'testuser1');
      await page.fill('input[name="Password"]', 'testpassword1');
      await page.click('text=login');
      const logoutButton = page.getByText('logout');
      await expect(logoutButton).toBeVisible();
      console.log('Successfully logged in!');
    });

    test('a new blog can be created', async ({ page }) => {
      await page.click('text=create new blog');
      await page.fill('input[placeholder="title"]', 'New Blog Title');
      await page.fill('input[placeholder="author"]', 'Blog Author');
      await page.fill('input[placeholder="url"]', 'http://newblogurl.com');
      await page.click('form >> text=create');
      const newBlogTitle = page.locator('.blog-title:has-text("New Blog Title")');
      await expect(newBlogTitle).toBeVisible();
    });

    test('a blog can be liked', async ({ page }) => {
      await page.click('text=create new blog');
      await page.fill('input[placeholder="title"]', 'New Blog Title');
      await page.fill('input[placeholder="author"]', 'Blog Author');
      await page.fill('input[placeholder="url"]', 'http://newblogurl.com');
      await page.click('form >> text=create');
      const newBlogTitle = page.locator('.blog-title:has-text("New Blog Title")');
      await expect(newBlogTitle).toBeVisible();
      await page.click('.blog >> text=view');
      const likeCountElement = page.locator('.blog-likes');
      const initialLikeCountText = await likeCountElement.textContent();
      const initialLikeCount = parseInt(initialLikeCountText.match(/\d+/)[0]);
      await page.click('.blog-likes >> text=like');
      await expect(likeCountElement).toHaveText(`likes ${initialLikeCount + 1} like`);
    });

    test('the user who added the blog can delete it', async ({ page }) => {
      await page.click('text=create new blog');
      await page.fill('input[placeholder="title"]', 'New Blog Title');
      await page.fill('input[placeholder="author"]', 'Blog Author');
      await page.fill('input[placeholder="url"]', 'http://newblogurl.com');
      await page.click('form >> text=create');
      const newBlogTitle = page.locator('.blog-title:has-text("New Blog Title")');
      await expect(newBlogTitle).toBeVisible();
      await page.click('.blog >> text=view');
      
      page.on('dialog', async dialog => {
        await dialog.accept();
      });

      const removeButton = page.locator('.blog >> text=remove');
      await expect(removeButton).toBeVisible();
      await removeButton.click();
      await expect(newBlogTitle).not.toBeVisible();
    });

    test('only the user who added the blog sees the delete button', async ({ page }) => {
      await page.click('text=create new blog');
      await page.fill('input[placeholder="title"]', 'User 1 Blog Title');
      await page.fill('input[placeholder="author"]', 'User 1');
      await page.fill('input[placeholder="url"]', 'http://user1blogurl.com');
      await page.click('form >> text=create');
      const user1BlogTitle = page.locator('.blog-title:has-text("User 1 Blog Title")');
      await expect(user1BlogTitle).toBeVisible();

      await page.click('text=logout');
      const loginButton = page.getByRole('button', { name: 'log in' });
      await expect(loginButton).toBeVisible();

      await page.click('text=log in');
      await page.fill('input[name="Username"]', 'testuser2');
      await page.fill('input[name="Password"]', 'testpassword2');
      await page.click('text=login');
      const logoutButton = page.getByText('logout');
      await expect(logoutButton).toBeVisible();

      await page.click('.blog >> text=view');
      const removeButton = page.locator('.blog >> text=remove');
      await expect(removeButton).not.toBeVisible();
    });
  });
});
