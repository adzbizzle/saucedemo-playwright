import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('UserCanLogIn', async ({ page }) => {
const login = new LoginPage(page);

  await login.goto();
  await login.enterUsername('standard_user');
  await login.enterPassword('secret_sauce');
  await login.clickLogin();

  await expect(page.getByText('Swag Labs')).toBeVisible();
});