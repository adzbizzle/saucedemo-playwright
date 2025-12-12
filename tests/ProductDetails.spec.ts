import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('User can view product details', async ({ page }) => {
    const login = new LoginPage(page);

    // Log in
    await login.goto();
    await login.enterUsername('standard_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    // Click backpack
    await page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' }).click();
    // Verify correct URL for backpack
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');

    // Verify correct product name of backpack
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');


    // Verify description is present
    await expect(page.locator('[data-test="inventory-item-desc"]')).toBeVisible();

    // Verify price is present

    await expect(page.locator('[data-test="inventory-item-price"]')).toBeVisible();

    // --- PRINT FOUND DETAILS TO TERMINAL ---
    const name = await page.locator('.inventory_details_name').textContent();
    const desc = await page.locator('[data-test="inventory-item-desc"]').textContent();
    const price = await page.locator('[data-test="inventory-item-price"]').textContent();

    console.log("PRODUCT NAME:", name?.trim());
    console.log("DESCRIPTION:", desc?.trim());
    console.log("PRICE:", price?.trim());






})