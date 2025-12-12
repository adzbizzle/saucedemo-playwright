import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('User can add and remove an item from the cart', async ({ page }) => {
    const login = new LoginPage(page);

    // Log in
    await login.goto();
    await login.enterUsername('standard_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    // Add Backpack to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Assert cart badge = 1
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Remove Backpack
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    // Assert cart badge disappears
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});
