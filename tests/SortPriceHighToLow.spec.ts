import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('User can sort prices high to low', async ({ page }) => {
    const login = new LoginPage(page);

    // Log in
    await login.goto();
    await login.enterUsername('standard_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    // Sort High to Low prices
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');

    // Get all prices as strings
    const rawPrices = await page.locator('.inventory_item_price').allTextContents();

    // Convert prices without $
    const prices = rawPrices.map(p => parseFloat(p.replace('$', '')));

    // Make a sorted copy (decending order)
    const sortedPricesDesc = [...prices].sort((a, b) => b - a);

    console.log("RAW PRICES:", rawPrices);
    console.log("NUMERIC PRICES:", prices);
    console.log("SORTED EXPECTED:", sortedPricesDesc);


    //compare UI vs sorted order
    expect(prices).toEqual(sortedPricesDesc)


});