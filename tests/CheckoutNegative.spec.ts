import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Checkout negative flows - SauceDemo', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    // add one item and go to checkout info page
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    await expect(page.locator('[data-test="continue"]')).toBeVisible();
  });

  test('Missing first name shows error', async ({ page }) => {
    await page.locator('[data-test="lastName"]').fill('Montana');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');
  });

  test('Missing last name shows error', async ({ page }) => {
    await page.locator('[data-test="firstName"]').fill('Tony');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');
  });

  test('Missing postal code shows error', async ({ page }) => {
    await page.locator('[data-test="firstName"]').fill('Tony');
    await page.locator('[data-test="lastName"]').fill('Montana');
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');
  });
});
