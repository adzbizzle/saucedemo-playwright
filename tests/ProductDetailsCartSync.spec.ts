import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('Product details and inventory cart buttons stay in sync', async ({ page }) => {
    const login = new LoginPage(page);

    // Log in
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    // Open Backpack details and wait for details page
    await page.getByText('Sauce Labs Backpack').click();
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');

    // Add to cart on details page (use role-based selector)
    await page.locator('[data-test="add-to-cart"]').click();

    // Go back to inventory and wait for products heading
    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(page.getByText('Products')).toBeVisible();

    // Verify inventory shows Remove for backpack
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');

    // Verify cart badge updated
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Go back to details and remove
    await page.getByText('Sauce Labs Backpack').click();
    await page.locator('[data-test="remove"]').click();

    // Back to inventory and verify Add to cart is back
    await page.getByRole('button', { name: 'Back to products' }).click();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText('Add to cart');

    // Verify cart badge removed
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});

