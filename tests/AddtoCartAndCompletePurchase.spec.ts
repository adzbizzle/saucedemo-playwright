import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('UserCanPurchase', async ({ page }) => {
const login = new LoginPage(page);
await login.goto();
await login.login('standard_user','secret_sauce');



  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill('Tony');
  await page.locator('[data-test="firstName"]').press('Tab');
  await page.locator('[data-test="lastName"]').fill('Montana');
  await page.locator('[data-test="lastName"]').press('Tab');
  await page.locator('[data-test="postalCode"]').fill('M8 1aa');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();

  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});