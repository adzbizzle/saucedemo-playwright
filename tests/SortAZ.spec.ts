import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('User can sort items alphabetically Z to A', async ({ page }) => {
    const login = new LoginPage(page);

    // Log in
    await login.goto();
    await login.enterUsername('standard_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();
    // Sort Z to A
    await page.locator('[data-test="product-sort-container"]').selectOption('za');

    // Get the names from the UI and put into an Array
    const names = await page.locator('.inventory_item_name').allTextContents();

    //sort the array into reverse order
    const sortedNameDesc = [...names].sort((a, b) => b.localeCompare(a));

    //compare UI vs expected reverse order
    expect(names).toEqual(sortedNameDesc);

});


