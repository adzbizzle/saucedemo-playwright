import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('Cart badge updates correctly when adding multiple items', async ({ page }) => {
    const login = new LoginPage(page);

    // Log in
    await login.goto();
    await login.enterUsername('standard_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="item-4-title-link"] [data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="item-0-title-link"] [data-test="inventory-item-name"]')).toContainText('Sauce Labs Bike Light');

    const cartItems = await page.locator('.inventory_item_name').allTextContents();
    console.log('CART ITEMS FOUND:', cartItems);
    expect(cartItems).toContain('Sauce Labs Backpack');
    expect(cartItems).toContain('Sauce Labs Bike Light');


});