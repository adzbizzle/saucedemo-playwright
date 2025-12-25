import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('Problem user product images are incorrect', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('problem_user', 'secret_sauce');

  // wait for inventory items to be visible
  await expect(page.locator('.inventory_list')).toBeVisible();

  // Collect product image srcs
  const srcs: string[] = await page
    .locator('.inventory_item_img img')
    .evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src));

  // Expect there to be duplicate image sources (known problem for problem_user)
  const uniqueSrcs = Array.from(new Set(srcs));
  expect(uniqueSrcs.length).toBeLessThan(srcs.length);

  // Also check for any broken images (naturalWidth === 0)
  const brokenCount: number = await page
    .locator('.inventory_item_img img')
    .evaluateAll((imgs) => imgs.filter((i) => (i as HTMLImageElement).naturalWidth === 0).length);

  // At least one image should be broken or duplicated for the problem_user
  expect(brokenCount + (srcs.length - uniqueSrcs.length)).toBeGreaterThan(0);
});
