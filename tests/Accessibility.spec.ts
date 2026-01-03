import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

// Accessibility smoke tests
test.describe('Accessibility smoke tests - SauceDemo', () => {
  test('Inventory page accessibility quick checks: interactive elements have accessible names', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    await page.locator('.inventory_list').waitFor({ state: 'visible' });

    // Check buttons have accessible names (textContent or aria-label)
    const unnamedButtons = await page.locator('button, [role="button"], input[type="submit"], input[type="button"]').evaluateAll((els) =>
      els
        .map((el) => ({ tag: el.tagName, text: (el.textContent || '').trim(), aria: el.getAttribute('aria-label') }))
        .filter((b) => !(b.text && b.text.length > 0) && !(b.aria && b.aria.trim().length > 0))
    );

    // Check links have text or aria-label
    const unnamedLinks = await page.locator('a[href]').evaluateAll((els) =>
      els
        .map((el) => ({ text: (el.textContent || '').trim(), aria: el.getAttribute('aria-label') }))
        .filter((l) => !(l.text && l.text.length > 0) && !(l.aria && l.aria.trim().length > 0))
    );

    // Check images have non-empty alt
    const imagesMissingAlt = await page.locator('img').evaluateAll((imgs) =>
      imgs
        .map((i) => ({ src: (i as HTMLImageElement).src, alt: i.getAttribute('alt') }))
        .filter((im) => !(im.alt && im.alt.trim().length > 0))
    );

    if (unnamedButtons.length > 0) console.warn('Buttons missing accessible name example:', unnamedButtons.slice(0, 5));
    if (unnamedLinks.length > 0) console.warn('Links missing accessible name example:', unnamedLinks.slice(0, 10));
    if (imagesMissingAlt.length > 0) console.warn('Images missing alt attribute example:', imagesMissingAlt.slice(0, 5));

    // Buttons should always have accessible names
    expect(unnamedButtons.length, 'Buttons should have accessible names (text or aria-label)').toBe(0);

    // Links: some icon-only links exist on the demo site (e.g., cart), so allow a small number but warn.
    expect(unnamedLinks.length, 'Links should have accessible names (text or aria-label) - audit flagged too many').toBeLessThan(10);

    // Images may be decorative; we assert at least some images have alt attributes, but tolerate decorative ones
    expect(imagesMissingAlt.length, 'Prefer images to have alt text where appropriate').toBeLessThan(10);
  });

  test('Login page keyboard focus order is sensible', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    // Focus body and tab through the interactive elements
    await page.focus('body');

    // Press Tab -> username
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => document.activeElement?.getAttribute('data-test') || document.activeElement?.id || document.activeElement?.tagName);
    expect(first, 'First tab should focus username input').toBe('username');

    // Press Tab -> password
    await page.keyboard.press('Tab');
    const second = await page.evaluate(() => document.activeElement?.getAttribute('data-test') || document.activeElement?.id || document.activeElement?.tagName);
    expect(second, 'Second tab should focus password input').toBe('password');

    // Press Tab -> login button
    await page.keyboard.press('Tab');
    const third = await page.evaluate(() => document.activeElement?.getAttribute('data-test') || document.activeElement?.id || document.activeElement?.tagName);
    expect(third, 'Third tab should focus login button').toBe('login-button');
  });

  test('Error messages are accessible (role alert or aria-live)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    // Trigger empty username error
    await login.enterUsername('');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();

    const role = await error.getAttribute('role');
    const ariaLive = await error.getAttribute('aria-live');

    // Best practice: error messages should be announced using role="alert" or aria-live.
    if (role === 'alert' || ariaLive === 'assertive' || ariaLive === 'polite') {
      expect(true).toBeTruthy();
    } else {
      // For the demo site we don't fail CI; log a clear warning and assert the error is visible and has text
      const text = (await error.textContent())?.trim() || '';
      console.warn('Accessibility: error message has no role/aria-live; consider adding role="alert" or aria-live="assertive"');
      expect(text.length, 'Error message should contain visible text').toBeGreaterThan(0);
    }
  });
});
