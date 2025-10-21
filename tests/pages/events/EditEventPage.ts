import { Page, Locator } from '@playwright/test';

export class EditEventPage {
    readonly page: Page;
    readonly statusButton: Locator;
    readonly mainRegion: Locator;

    constructor(page: Page) {
        this.page = page;
        this.statusButton = page.getByRole('button', { name: /Event Status/i });
        this.mainRegion = page.getByRole('main');
    }

    private get eventNameInput(): Locator {
        return this.page.getByRole('textbox', { name: /Event (Name|Title)/i });
    }

    private async ensureEditMode() {
        // If already editable, continue
        try { if (await this.eventNameInput.isVisible({ timeout: 500 })) return; } catch { }

        // Try a visible "Edit" text on the same page
        try {
            const editText = this.page.getByText('Edit', { exact: true });
            if (await editText.isVisible({ timeout: 500 })) {
                await editText.click();
            }
        } catch { }

        // Try common role-based edit buttons if present
        const candidates = ['Edit', 'Edit Event', 'Edit details', 'Edit Details', 'Update'];
        for (const label of candidates) {
            const btn = this.page.getByRole('button', { name: label });
            try {
                if (await btn.isVisible({ timeout: 500 })) {
                    await btn.click();
                    break;
                }
            } catch { /* continue */ }
        }
        // Do not strictly wait on role-based input; some UIs use custom inputs.
    }

    async setName(name: string) {
        await this.ensureEditMode();
        const candidates: Locator[] = [
            this.page.getByRole('textbox', { name: /Event (Name|Title)/i }),
            this.page.locator('input[name="name"]'),
            this.page.locator('input[placeholder="Enter event name"]'),
            this.page.locator('input[id^="react-aria"][id*="r1d"]'),
            this.page.locator('[id^="react-aria"][id*="r1d"]').filter({ has: this.page.locator('input') }).locator('input')
        ];
        for (const loc of candidates) {
            try {
                await loc.waitFor({ state: 'visible', timeout: 2000 });
                await loc.fill(name);
                return;
            } catch { /* try next */ }
        }
        throw new Error('Event name input not found');
    }

    async setStatus(statusLabel: string) {
        await this.ensureEditMode();
        await this.statusButton.click();
        await this.page.getByRole('option', { name: statusLabel }).locator('div').nth(1).click();
    }

    async save() {
        await this.ensureEditMode();
        // 1) Prefer a button role
        const roleCandidates = [/Update Event/i, /Save Changes/i, /^Save$/i];
        for (const label of roleCandidates) {
            const btn = this.page.getByRole('button', { name: label }).first();
            try {
                await btn.click({ timeout: 1500 });
                return;
            } catch { /* continue */ }
        }

        // 2) Text-only fallback
        try {
            await this.page.getByText('Update Event', { exact: true }).click({ timeout: 1500 });
            return;
        } catch { }

        try {
            await this.page.locator('text=Update Event').first().click({ timeout: 1500 });
            return;
        } catch { }

        // 3) Last resort: query any element containing text and click via JS
        const handle = await this.page.locator('//*[contains(normalize-space(.), "Update Event")]').first();
        try {
            await handle.click({ timeout: 1500 });
            return;
        } catch { }

        throw new Error('Could not find a Save/Update control on the edit event page');
    }
}


