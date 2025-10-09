import { test, expect } from '../../fixtures/baseFixtures';
import users from '../../../test-data/users.json';

test.describe('Login - positive', () => {
  for (const data of users.login.positive) {
    test(`should login: ${data.email}`, async ({ pages }) => {
      await pages.loginPage.goto();
      await expect(pages.loginPage.heading).toContainText('Log in to your account');
      await pages.loginPage.login(data.email, data.password);
      await expect(pages.loginPage.page).toHaveURL(/\/dashboard/, { timeout: 15000 });
      // Optional: assert dashboard marker if available
      // await expect(pages.loginPage.main).toContainText('Welcome');
    });
  }
});

test.describe('Login - negative', () => {
  for (const data of users.login.negative) {
    test(`should fail: ${JSON.stringify({ email: data.email })}`, async ({ pages }) => {
      await pages.loginPage.goto();
      await pages.loginPage.login(data.email, data.password);
      await expect(pages.loginPage.page).not.toHaveURL(/\/dashboard/);
      await expect(pages.loginPage.heading).toContainText('Log in to your account');
      if (data.error) {
        await expect(pages.loginPage.page.getByText(new RegExp(data.error, 'i'))).toBeVisible();
      }
    });
  }
});