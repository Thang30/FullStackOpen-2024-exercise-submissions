const { test, expect, beforeEach, describe } = require('@playwright/test');

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await page.screenshot({ path: 'screenshots/page_loaded.png' });
    await page.click('text=log in'); // Click the log in button to reveal the form
    const loginHeader = page.getByText('Log in to application');
    await expect(loginHeader).toBeVisible();
    await page.screenshot({ path: 'screenshots/login_form_visible.png' });
  });
});
