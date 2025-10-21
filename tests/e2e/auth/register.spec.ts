import { test, expect } from '../../fixtures/baseFixtures';
import users from '../../../test-data/users.json';

test.describe('Register - positive @auth @regression', () => {
    for (const data of users.register.positive) {
        test(`should register: ${data.firstName} ${data.lastName}`, async ({ pages }) => {
            await pages.registerPage.goto();
            const email = data.email.replace('{{ts}}', String(Date.now()));
            await pages.registerPage.register(data.firstName, data.lastName, email, data.password);
            await expect(pages.registerPage.heading).toContainText('Verify your email');
            await expect(pages.registerPage.page).toHaveURL(/\/verify-otp/, { timeout: 15000 });
        });
    }
});

test.describe('Register - negative @auth @regression', () => {
    for (const data of users.register.negative) {
        test(`should fail: ${JSON.stringify(data)}`, async ({ pages }) => {
            await pages.registerPage.goto();
            const email = (data.email || '').includes('{{ts}}') ? data.email.replace('{{ts}}', String(Date.now())) : data.email;
            await pages.registerPage.register(data.firstName, data.lastName, email, data.password);
            await expect(pages.registerPage.heading).toContainText('Create an account');
            if (data.error) {
                if (/valid email/i.test(data.error)) {
                    await expect(pages.registerPage.workEmailInput).toHaveAttribute('aria-invalid', 'true');
                } else {
                    await expect(pages.registerPage.page.getByText(new RegExp(data.error, 'i'))).toBeVisible();
                }
            }
        });
    }
});
