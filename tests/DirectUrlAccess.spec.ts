import { test, expect } from '@playwright/test';


test('Direct URL access to inventory page without login redirects to login page', async ({ page }) => {
    // Attempt to navigate directly to the inventory page
    await page.goto('https://www.saucedemo.com/inventory.html');
    // Verify that we are redirected to the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});

test('Direct URL access to cart page without login redirects to login page', async ({ page }) => {
    // Attempt to navigate directly to the cart page
    await page.goto('https://www.saucedemo.com/cart.html');
    // Verify that we are redirected to the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});