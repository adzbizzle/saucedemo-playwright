import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('User can remove an item from the cart', async ({ page }) => {
    const login = new LoginPage(page);

    // Login
    await login.goto();
    await login.enterUsername('standard_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await page.locator('.shopping_cart_link').click();

    const beforeRemoval = await page.locator('.inventory_item_name').allTextContents();
    console.log('Before removal:', beforeRemoval);

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    const afterRemoval = await page.locator('.inventory_item_name').allTextContents();
    console.log('After removal:', afterRemoval);

    // assertion
    expect(afterRemoval).not.toContain('Sauce Labs Backpack');
    expect(afterRemoval).toContain('Sauce Labs Bike Light');
    expect(afterRemoval.length).toBe(1);

})
