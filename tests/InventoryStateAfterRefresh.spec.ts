import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('Inventory state persists after page refresh', async ({ page }) => {
    const login = new LoginPage(page);

    // Log in
    await login.goto();
    await login.enterUsername('standard_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    // Add Backpack to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Refresh the page
    await page.reload();
    // Verify Backpack is still in the cart
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();

    // Remove Backpack from cart
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    // Refresh the page
    await page.reload();
    // Verify Backpack is removed from the cart
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
});
