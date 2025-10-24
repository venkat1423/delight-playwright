import { Page, Locator, expect } from '@playwright/test';

export class AllCampaignsPage {
    readonly page: Page;
    readonly mainRegion: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mainRegion = page.getByRole('main').first();
    }

    async gotoList() {
        await this.page.getByRole('link', { name: 'Campaigns' }).click();
        await expect(this.mainRegion).toContainText('Campaign');
    }

    async openCreateForm() {
        await this.page.getByRole('button', { name: '+ New Campaign' }).click();
        // UI shows a wizard intro; wait for stable intro/goal text
        await expect(this.mainRegion).toContainText(/Create Your Campaign|Select your campaign goal/);
    }
}


