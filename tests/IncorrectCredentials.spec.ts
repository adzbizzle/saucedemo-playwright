import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Negative Login Tests - SauceDemo', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
  });

  // Wrong username
  test('Invalid credentials show "do not match" error', async ({ page }) => {
    const login = new LoginPage(page);

    await login.enterUsername('wrong_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  // Wrong password
  test('Invalid password shows "do not match" error', async ({ page }) => {
    const login = new LoginPage(page);

    await login.enterUsername('standard_user');
    await login.enterPassword('incorrect_password');
    await login.clickLogin();

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  // Empty username
  test('Empty username shows "Username is required" error', async ({ page }) => {
    const login = new LoginPage(page);

    await login.enterUsername('');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Epic sadface: Username is required');
  });

  // Empty password
  test('Empty password shows "Password is required" error', async ({ page }) => {
    const login = new LoginPage(page);

    await login.enterUsername('standard_user');
    await login.enterPassword('');
    await login.clickLogin();

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Epic sadface: Password is required');
  });

  // Locked-out user
  test('Locked-out user cannot log in', async ({ page }) => {
    const login = new LoginPage(page);

    await login.enterUsername('locked_out_user');
    await login.enterPassword('secret_sauce');
    await login.clickLogin();

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

});
