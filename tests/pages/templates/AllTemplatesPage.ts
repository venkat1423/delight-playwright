import { Locator, Page, expect } from '@playwright/test';

export class AllTemplatesPage {
    readonly page: Page;
    readonly mainRegion: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mainRegion = page.getByRole('main');
    }

    async gotoList() {
        await this.page.getByRole('link', { name: 'Templates' }).click();
        await expect(this.mainRegion).toBeVisible();
    }

    async openCreateForm() {
        await this.page.getByRole('button', { name: 'New Template' }).click();
        await this.page.getByRole('textbox', { name: 'Template Name' }).waitFor({ state: 'visible' });
    }
}


