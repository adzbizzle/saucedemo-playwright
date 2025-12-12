import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('User can logout successfully', async ({ page }) => {
    const login = new LoginPage(page);

    // Log in first
    await login.goto();
    await login.enterUsername('standard_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    // Open the side menu
    await page.getByRole('button', { name: 'Open Menu' }).click();

    // Click logout
    await page.locator('#logout_sidebar_link').click();

    // Assert the user is returned to the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // Verify username field is visible again
    await expect(page.locator('#user-name')).toBeVisible();
});
