import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async enterUsername(username: string) {
    await this.page.locator('[data-test="username"]').fill(username);
  }

  async enterPassword(password: string) {
    await this.page.locator('[data-test="password"]').fill(password);
  }

  async clickLogin() {
    await this.page.locator('[data-test="login-button"]').click();
  }
  
  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();}
}
