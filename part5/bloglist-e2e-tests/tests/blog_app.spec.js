const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Empty the database
    await request.post('/api/testing/reset');

    // Create a user for the backend
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpassword'
      }
    });

    // Go to the page
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await page.click('text=log in'); // Click the log in button to reveal the form
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
      await page.waitForTimeout(1000); // Add a short delay

      const logoutButton = page.getByText('logout');
      await expect(logoutButton).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.click('text=log in');
      await page.fill('input[name="Username"]', 'testuser');
      await page.fill('input[name="Password"]', 'wrongpassword');
      await page.click('text=login');

      const errorMessage = page.getByText('invalid username or password');
      await expect(errorMessage).toBeVisible();
    });
  });
});
