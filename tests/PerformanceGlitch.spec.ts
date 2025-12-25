import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('Performance glitch user can load inventory and perform actions', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();

  const start = Date.now();
  await login.login('performance_glitch_user', 'secret_sauce');

  // Wait for inventory to be visible (allow extended timeout for the glitch)
  await page.locator('.inventory_list').waitFor({ state: 'visible', timeout: 15000 });
  const loadTime = Date.now() - start;
  console.log('Performance glitch user load time (ms):', loadTime);

  // Inventory should be visible and contain product names
  await expect(page.locator('.inventory_list')).toBeVisible();
  const names = await page.locator('.inventory_item_name').allTextContents();
  expect(names.length).toBeGreaterThan(0);

  // Try adding an item and verify the cart badge updates
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1', { timeout: 10000 });

  // Ensure loadTime is reasonable (not flaky CI; generous threshold)
  expect(loadTime).toBeLessThan(15000);
});
