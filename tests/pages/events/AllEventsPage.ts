import { Page, Locator } from '@playwright/test';

export class AllEventsPage {
    readonly page: Page;
    readonly eventsLink: Locator;
    readonly mainRegion: Locator;
    readonly myEventsRadio: Locator;
    readonly allEventsRadio: Locator;
    readonly searchInput: Locator;
    readonly addEventButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eventsLink = page.getByRole('link', { name: 'Events' });
        this.mainRegion = page.getByRole('main');
        this.myEventsRadio = page.getByRole('radio', { name: 'My Events' });
        this.allEventsRadio = page.getByRole('radio', { name: 'All Events' });
        this.searchInput = page.getByRole('textbox', { name: 'Search events...' });
        this.addEventButton = page.getByRole('button', { name: '+ Add Event' });
    }

    async gotoList() {
        await this.eventsLink.click();
        await this.mainRegion.waitFor({ state: 'visible' });
    }

    async selectMyEvents() {
        await this.myEventsRadio.click();
    }

    async selectAllEvents() {
        await this.allEventsRadio.click();
    }

    async search(term: string) {
        await this.searchInput.fill(term);
    }

    async openCreateForm() {
        await this.addEventButton.click();
    }

    async openEventByName(name: string) {
        const heading = this.page.getByRole('heading', { name }).first();
        await heading.waitFor({ state: 'visible', timeout: 30000 });
        const card = heading.locator('..').locator('..');
        // 1) Prefer anchor within the card and navigate directly to /edit
        const link = card.locator('a[href*="/events/"]').first();
        if (await link.count()) {
            const href = await link.getAttribute('href');
            if (href) {
                await this.page.goto(href.endsWith('/edit') ? href : `${href}/edit`);
                await this.waitForEditForm();
                return;
            }
        }

        // 2) Try heading region click
        try {
            await heading.scrollIntoViewIfNeeded();
            await heading.click({ position: { x: 10, y: 10 } });
            await this.waitForEditForm();
            return;
        } catch { /* fall through */ }

        // 3) Click overlay as last resort
        try {
            const overlay = card.locator('.w-full.h-full.flex.items-center').first();
            if (await overlay.count()) {
                await overlay.click({ force: true });
                await this.waitForEditForm();
                return;
            }
        } catch { /* ignore */ }

        // 4) Fallback: plain heading click
        await heading.click();
        await this.waitForEditForm();
    }

    async openFirstEvent() {
        // 1) Try anchor first and navigate to /edit
        const firstLink = this.page.locator('a[href*="/events/"]').first();
        if (await firstLink.count()) {
            const href = await firstLink.getAttribute('href');
            if (href) {
                await this.page.goto(href.endsWith('/edit') ? href : `${href}/edit`);
                await this.waitForEditForm();
                return;
            }
        }

        // 2) Try the first heading text area
        const firstHeading = this.page.getByRole('heading').first();
        try {
            await firstHeading.waitFor({ state: 'visible', timeout: 30000 });
            await firstHeading.scrollIntoViewIfNeeded();
            await firstHeading.click({ position: { x: 10, y: 10 } });
            await this.waitForEditForm();
            return;
        } catch { /* try other selectors */ }

        // 3) Fallback: clickable overlay
        const firstCardOverlay = this.page.locator('.w-full.h-full.flex.items-center').first();
        if (await firstCardOverlay.count()) {
            await firstCardOverlay.click({ force: true });
            await this.waitForEditForm();
            return;
        }
    }

    async openEditFromList(name: string) {
        // Scope to the card that contains the heading with the given name
        const card = this.page.getByRole('heading', { name }).first().locator('..').locator('..');
        const menuButton = card.getByRole('button', { name: 'Open menu' });
        await menuButton.click();
        // Prefer visible text 'Edit' as per provided script
        try {
            const editByText = this.page.getByText('Edit', { exact: true });
            await editByText.waitFor({ state: 'visible', timeout: 2000 });
            await editByText.click();
            return;
        } catch { /* fallback below */ }
        // Fallback roles/names
        const candidates = [
            { role: 'menuitem', name: 'Edit' },
            { role: 'menuitem', name: 'Edit Event' },
            { role: 'button', name: 'Edit' },
            { role: 'button', name: 'Edit Event' },
        ];
        for (const c of candidates) {
            const item = this.page.getByRole(c.role as any, { name: c.name });
            try {
                if (await item.isVisible({ timeout: 500 })) {
                    await item.click();
                    return;
                }
            } catch { /* continue */ }
        }
        throw new Error('Edit action not found in event menu');
    }

    async gotoEditByName(name: string) {
        const heading = this.page.getByRole('heading', { name }).first();
        await heading.waitFor({ state: 'visible', timeout: 10000 });
        await heading.scrollIntoViewIfNeeded();

        // Use the card that contains this heading and the Create Campaign button
        const card = heading.locator("xpath=ancestor::div[.//button[normalize-space()='Create Campaign']][1]");
        const optionsBtn = card.locator("xpath=.//button[not(@disabled)][last()]");
        try {
            await optionsBtn.click({ timeout: 3000 });
            const editItem = this.page.getByRole('menuitem', { name: /Edit/i }).first();
            await editItem.click();
            await this.waitForEditForm();
            return;
        } catch { /* fall back to clicking the heading/link */ }

        const anchor = heading.locator('xpath=ancestor::a[1]');
        if (await anchor.count()) {
            await anchor.first().click();
        } else {
            await heading.click();
        }
        await this.waitForEditForm();
    }

    async gotoEditCurrent() {
        const current = this.page.url();
        await this.page.goto(current.endsWith('/edit') ? current : `${current}/edit`);
    }

    async openEditMenuForFirstCard() {
        // Assumes list is filtered to target event; opens the first card's kebab and clicks Edit
        const kebab = this.page.locator('button[id^="react-aria"]').first();
        await kebab.click();
        await this.page.getByText('Edit', { exact: true }).click();
        await this.waitForEditForm();
    }

    async openEditFromFirst() {
        const firstHeading = this.page.getByRole('heading').first();
        await firstHeading.waitFor({ state: 'visible', timeout: 10000 });
        const card = firstHeading.locator('..').locator('..');
        await firstHeading.scrollIntoViewIfNeeded();
        await card.hover();
        const menuButton = card.locator('button').last();
        await menuButton.click();
        try {
            const editByText = this.page.getByText('Edit', { exact: true });
            await editByText.waitFor({ state: 'visible', timeout: 2000 });
            await editByText.click();
            return;
        } catch { /* fallback below */ }
        // react-aria menu fallback per provided snippet
        try {
            const reactAriaMenuBtn = card.locator('button[id^="react-aria"]').first();
            await reactAriaMenuBtn.click();
            await this.page.getByText('Edit').click();
            return;
        } catch { /* continue to candidates */ }
        const candidates = [
            { role: 'menuitem', name: 'Edit' },
            { role: 'menuitem', name: 'Edit Event' },
            { role: 'button', name: 'Edit' },
            { role: 'button', name: 'Edit Event' },
        ];
        for (const c of candidates) {
            const item = this.page.getByRole(c.role as any, { name: c.name });
            try {
                if (await item.isVisible({ timeout: 500 })) {
                    await item.click();
                    return;
                }
            } catch { /* continue */ }
        }
        throw new Error('Edit action not found in first card menu');
    }

    private async waitForEditForm() {
        const nameInput = this.page.locator('input[name="name"]');
        const editText = this.mainRegion.filter({ hasText: 'Edit event details and configuration' });
        await Promise.race([
            nameInput.waitFor({ state: 'visible', timeout: 30000 }),
            editText.waitFor({ state: 'visible', timeout: 30000 })
        ]);
    }

    async gotoEditLatestByContainerXPath() {
        // Click the latest card via provided XPath, then click Edit text
        const container = this.page.locator('xpath=//*[@id="root"]/div/main/div/div[2]/div/div[1]/div[2]').first();
        await container.scrollIntoViewIfNeeded();
        try {
            await container.click();
        } catch {
            const anchor = container.locator('a').first();
            if (await anchor.count()) {
                await anchor.click();
            }
        }
        // Now trigger Edit on detail/menu by visible text
        try {
            await this.page.getByText('Edit', { exact: true }).click();
        } catch {
            // Try opening any react-aria menu then click Edit
            const anyMenuBtn = this.page.locator('button[id^="react-aria"]').first();
            await anyMenuBtn.click();
            await this.page.getByText('Edit', { exact: true }).click();
        }
        await this.waitForEditForm();
    }
}


