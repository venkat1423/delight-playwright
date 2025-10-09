import { Page, Locator } from '@playwright/test';
import { config } from '../../utils/config';

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly workEmailInput: Locator;
  readonly passwordInput: Locator;
  readonly getStartedBtn: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name *' });
    this.workEmailInput = page.getByRole('textbox', { name: 'Work Email *' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.getStartedBtn = page.getByRole('button', { name: 'Get started' });
    this.heading = page.getByRole('heading');
  }

  async goto() {
    await this.page.goto(`${config.baseUrl}/signup`);
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.workEmailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.getStartedBtn.click();
  }
}
