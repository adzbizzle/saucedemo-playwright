import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('User can remove multiple items from the cart', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.enterUsername('standard_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();


});