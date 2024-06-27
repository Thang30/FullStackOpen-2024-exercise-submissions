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
});
