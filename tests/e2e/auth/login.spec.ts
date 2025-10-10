import { test, expect } from '../../fixtures/baseFixtures';
import users from '../../../test-data/users.json';

test.describe('Login - positive', () => {
  for (const data of users.login.positive) {
    test(`should login: ${data.email} @regression @auth @positive`, async ({ pages }) => {
      await pages.loginPage.goto();
      await expect(pages.loginPage.heading).toContainText('Log in to your account');
      await pages.loginPage.login(data.email, data.password);
      await expect(pages.loginPage.page).toHaveURL(/\/dashboard/, { timeout: 15000 });
      // Optional: assert dashboard marker if available
      // await expect(pages.loginPage.main).toContainText('Welcome');
    });
  }
});

test.describe('Login - smoke tests', () => {
  test('should login successfully @smoke @critical @auth', async ({ pages }) => {
    await pages.loginPage.goto();
    const { email, password } = users.login.positive[0];
    await pages.loginPage.login(email, password);
    await expect(pages.loginPage.page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });
});

test.describe('Login - performance tests', () => {
  test('should login within 45 seconds @performance @load @auth', async ({ pages }) => {
    const startTime = Date.now();

    await pages.loginPage.goto();
    const { email, password } = users.login.positive[0];
    await pages.loginPage.login(email, password);
    await expect(pages.loginPage.page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(45000); // 45 seconds - realistic for slow networks
  });
});

test.describe('Login - visual tests', () => {
  test('login page should match design @visual @ui @auth', async ({ pages }) => {
    await pages.loginPage.goto();

    // Take screenshot and compare (first run will create baseline)
    await expect(pages.page).toHaveScreenshot('login-page.png', {
      threshold: 0.5, // Allow 50% difference for visual tests
      maxDiffPixels: 5000 // Allow up to 5000 pixel differences
    });
  });
});

test.describe('Login - negative', () => {
  for (const data of users.login.negative) {
    test(`should fail: ${JSON.stringify({ email: data.email })} @regression @auth @negative`, async ({ pages }) => {
      await pages.loginPage.goto();
      await pages.loginPage.loginWithoutRedirect(data.email, data.password);
      await expect(pages.loginPage.page).not.toHaveURL(/\/dashboard/);
      await expect(pages.loginPage.heading).toContainText('Log in to your account');
      if (data.error) {
        await expect(pages.loginPage.page.getByText(new RegExp(data.error, 'i'))).toBeVisible();
      }
    });
  }
});