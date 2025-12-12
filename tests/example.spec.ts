import { test, expect } from '@playwright/test';

test('open saucedemo', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
