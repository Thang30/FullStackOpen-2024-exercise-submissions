const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const resetResponse = await request.post('/api/testing/reset');
    console.log(`Database reset response status: ${resetResponse.status()}`);

    const userResponse = await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpassword'
      }
    });
    console.log(`User creation response status: ${userResponse.status()}`);

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
      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'testpassword');
      await page.click('text=login');
      const logoutButton = page.getByText('logout');
      await expect(logoutButton).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.click('text=log in');
      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'wrongpassword');
      await page.click('text=login');
      
      // Take a screenshot before checking the error message
      await page.screenshot({ path: 'screenshots/before_checking_error_message.png' });

      const errorMessage = page.getByText('Wrong credentials');
      await expect(errorMessage).toBeVisible({ timeout: 10000 }); // Extend the timeout to 10 seconds
    });
  });

  describe.only('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173');
      await page.click('text=log in');
      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'testpassword');
      await page.click('text=login');
      const logoutButton = page.getByText('logout');
      await expect(logoutButton).toBeVisible();
        console.log("Successfully logged in!");
    });

    test('a new blog can be created', async ({ page }) => {
      // Click the "create new blog" button to reveal the blog form
      await page.click('text=create new blog');

      // Fill in the blog details
      await page.fill('input[placeholder="title"]', 'New Blog Title');
      await page.fill('input[placeholder="author"]', 'Blog Author');
      await page.fill('input[placeholder="url"]', 'http://newblogurl.com');

      // Click the "create" button to submit the blog
        //   await page.click('button:text("create")');
      await page.click('form >> text=create');


      // Verify the new blog is visible
      const newBlogTitle = page.locator('.blog-title:has-text("New Blog Title")');
      await expect(newBlogTitle).toBeVisible();
    });
  });
});
