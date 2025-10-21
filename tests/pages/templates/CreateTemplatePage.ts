import { Page, Locator, expect } from '@playwright/test';

export class CreateTemplatePage {
    readonly page: Page;
    readonly mainRegion: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mainRegion = page.getByRole('main');
    }

    async setTemplateName(name: string) {
        await this.page.getByRole('textbox', { name: 'Template Name' }).fill(name);
    }

    async addTags(tags: string[]) {
        for (const t of tags) {
            await this.page.getByRole('textbox', { name: 'Add a tag' }).fill(t);
            await this.page.getByRole('button', { name: 'Add' }).click();
        }
    }

    async setDescription(text: string) {
        await this.page.getByRole('textbox', { name: 'Description' }).fill(text);
    }

    async chooseGiftModeLetRecipientsChoose() {
        await this.page.getByText('GiftOne Gift for All • No').click();
        await expect(this.page.locator('h2')).toContainText('Select Gift Mode');
        await this.page.getByRole('heading', { name: 'Let Recipients Choose' }).click();
    }

    async browseAndPickGifts(search: string, titles: string[]) {
        await this.page.getByRole('button', { name: 'Browse More Gifts' }).click();
        await this.page.getByRole('textbox', { name: 'Search gifts...' }).fill(search);
        // Tap scroll area to avoid backdrop intercepts
        await this.page.locator('.flex-grow.overflow-auto').first().click({ position: { x: 5, y: 5 } }).catch(() => { });

        for (const title of titles) {
            const heading = this.page.getByRole('heading', { name: title }).first();
            await heading.waitFor({ state: 'visible', timeout: 30000 });
            await heading.scrollIntoViewIfNeeded();
            const card = heading.locator('xpath=ancestor::div[contains(@class, "relative")]').first();
            try {
                await card.click({ position: { x: 10, y: 10 }, timeout: 3000 });
            } catch {
                try { await heading.focus({ timeout: 500 }); await this.page.keyboard.press('Enter'); }
                catch { await card.click({ force: true }); }
            }
        }
        await this.page.getByRole('button', { name: 'Confirm Selection' }).click();
        await expect(this.mainRegion).toContainText('Selected Gift Options');
    }

    async openGiftsDrawerAndSearch(search: string) {
        await this.page.getByRole('button', { name: 'Browse More Gifts' }).click();
        await this.page.getByRole('textbox', { name: 'Search gifts...' }).fill(search);
        await this.page.locator('.flex-grow.overflow-auto').first().click({ position: { x: 5, y: 5 } }).catch(() => { });
    }

    async selectGiftByName(title: string, index: number = 0) {
        const heading = this.page.getByRole('heading', { name: title }).nth(index);
        await heading.waitFor({ state: 'visible', timeout: 30000 });
        await heading.scrollIntoViewIfNeeded();
        const card = heading.locator('xpath=ancestor::div[contains(@class, "relative")]').first();
        try {
            await card.click({ position: { x: 10, y: 10 }, timeout: 3000 });
        } catch {
            try { await heading.focus({ timeout: 500 }); await this.page.keyboard.press('Enter'); }
            catch { await card.click({ force: true }); }
        }
    }

    async confirmGiftSelection() {
        await this.page.getByRole('button', { name: 'Confirm Selection' }).click();
        await expect(this.mainRegion).toContainText('Selected Gift Options');
    }

    async toggleGiftCards(titles: string[]) {
        for (const title of titles) {
            await this.page.getByRole('heading', { name: title }).first().click();
        }
        await expect(this.mainRegion).toContainText('Selected Gift Options');
    }

    async openPersonalizationAndSaveMessage(message: string) {
        await this.page.getByText('Personalization').click({ force: true });
        await this.page.getByText('🎁 Surprise!').first().click({ force: true }).catch(() => { });
        await this.page.getByRole('textbox', { name: 'Type your message...' }).fill(message);
        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    async openGiftingAnalytics() {
        await this.page.locator('div').filter({ hasText: /^Gifting Analytics$/ }).first().click();
    }

    async setLandingContent(text: string) {
        await this.page.getByRole('button', { name: 'Content' }).click();
        await this.page.getByRole('textbox', { name: 'Enter description...' }).fill(text);
    }

    async setEventDateToday() {
        await this.page.getByRole('button', { name: 'Calendar Event Date' }).click();
        await this.page.getByRole('button', { name: 'Today' }).click();
        await this.page.getByRole('button', { name: 'Apply' }).click();
    }

    async setVideoUrl(url: string) {
        await this.page.getByRole('button', { name: 'Media' }).click();
        await this.page.getByRole('tab', { name: 'Video' }).click();
        await this.page.getByRole('textbox', { name: 'Enter video URL' }).fill(url);
    }

    async setActionButtons(primaryLabel: string, primaryUrl: string, secondaryLabel: string, secondaryUrl: string) {
        await this.page.getByRole('button', { name: 'Action Buttons' }).click();
        const primary = this.page.getByText('Primary Button').locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
        await primary.getByRole('textbox').nth(0).fill(primaryLabel);
        await primary.getByRole('textbox').nth(1).fill(primaryUrl);

        const secondary = this.page.getByText('Secondary Button').locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
        await secondary.getByRole('textbox').nth(0).fill(secondaryLabel);
        await secondary.getByRole('textbox').nth(1).fill(secondaryUrl);
    }

    async create() {
        await this.page.getByRole('button', { name: 'Create Template' }).click();
        await expect(this.page.getByRole('main')).toContainText('Templates');
    }
}


