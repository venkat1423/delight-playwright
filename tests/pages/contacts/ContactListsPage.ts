import { Page, Locator } from '@playwright/test';

export class ContactListsPage {
    readonly page: Page;
    readonly mainRegion: Locator;
    readonly contactListsLink: Locator;
    readonly newContactListButton: Locator;
    readonly listNameInput: Locator;
    readonly tagInput: Locator;
    readonly addTagButton: Locator;
    readonly createListButton: Locator;
    readonly importButton: Locator;
    readonly chooseFileButton: Locator;
    readonly importContactsButton: Locator;
    readonly backToContactListsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mainRegion = page.getByRole('main');
        this.contactListsLink = page.getByRole('link', { name: 'Contact Lists' });
        this.newContactListButton = page.getByRole('button', { name: 'New Contact List' });
        this.listNameInput = page.getByRole('textbox', { name: 'Enter list name' });
        this.tagInput = page.getByRole('textbox', { name: 'Enter tag name' });
        this.addTagButton = page.getByRole('button', { name: 'Add Tag' });
        this.createListButton = page.getByRole('button', { name: 'Create List' });
        this.importButton = page.getByRole('button', { name: 'Import', exact: true });
        this.chooseFileButton = page.getByRole('button', { name: 'Choose File' });
        this.importContactsButton = page.getByLabel('Import from CSV').getByRole('button', { name: 'Import Contacts' });
        this.backToContactListsButton = page.getByRole('button', { name: 'Back to Contact-Lists' });
    }

    async gotoFromAnyPage() {
        await this.contactListsLink.click();
    }

    async openCreateDialog() {
        await this.newContactListButton.click();
    }

    async createList(name: string, tags: string[]) {
        await this.listNameInput.fill(name);
        for (const tag of tags) {
            await this.tagInput.fill(tag);
            await this.addTagButton.click();
        }
        await this.createListButton.click();
    }

    async waitForListDetail(name: string, timeoutMs: number = 10000) {
        await this.page.getByRole('heading', { name }).waitFor({ state: 'visible', timeout: timeoutMs });
    }

    async openImportDialog() {
        await this.importButton.waitFor({ state: 'visible' });
        await this.importButton.click();
    }

    async importFromCsv(filePath: string) {
        await this.chooseFileButton.setInputFiles(filePath);
        await this.importContactsButton.click();
    }

    async backToLists() {
        await this.backToContactListsButton.click();
    }

    async openListByName(name: string) {
        const link = this.page.getByRole('link', { name });
        if (await link.count()) {
            await link.first().click();
            return;
        }
        const heading = this.page.getByRole('heading', { name });
        await heading.first().click();
    }
}


