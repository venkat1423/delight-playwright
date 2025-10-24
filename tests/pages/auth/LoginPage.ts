import { Page, Locator } from '@playwright/test';
import { config } from '../../utils/config';

export class LoginPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly main: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole('heading');
        this.emailInput = page.getByRole('textbox', { name: 'Email *' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
        this.signInButton = page.getByRole('button', { name: 'Sign in' });
        this.main = page.getByRole('main');
    }

    async goto() {
        await this.page.goto(`${config.baseUrl}/login`);
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await Promise.all([
            this.page.waitForURL(/\/dashboard(\?.*)?$/),
            this.signInButton.click(),
        ]);
        // Wait for page to load after redirect
        await this.page.waitForLoadState('networkidle');
    }

    async loginWithoutRedirect(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        // Don't wait for redirect - used for negative tests
    }

    async logout() {
        try {
            await this.page.goto(`${config.baseUrl}/logout`);
            // Handle case where logout doesn't redirect to login
            try {
                await this.page.waitForURL(/\/login(\?.*)?$/, { timeout: 5000 });
            } catch (error) {
                // If logout doesn't redirect, navigate to login manually
                await this.page.goto(`${config.baseUrl}/login`);
            }
            await this.signInButton.waitFor({ state: 'visible' });
        } catch (error) {
            // If page is closed during logout, that's expected behavior
            console.log('Logout completed - page may have been closed');
        }
    }
}
