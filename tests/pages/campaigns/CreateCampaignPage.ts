import { Page, Locator, expect } from '@playwright/test';

export class CreateCampaignPage {
    readonly page: Page;
    readonly mainRegion: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mainRegion = page.getByRole('main').first();
    }

    // Step 1: Choose goal - Drive Event
    async chooseGoalDriveEvent() {
        await expect(this.page.locator('h2')).toContainText('Select your campaign goal');
        await this.page.getByText('Drive Event').click();
        await expect(this.mainRegion).toContainText('Select your campaign motion');
    }

    // Step 2: Choose motion - Boost Registration
    async chooseMotionBoostRegistration() {
        await this.page.getByText('Select a motion to determine').click();
        await this.page.getByText('Boost Registration').click();
        await expect(this.mainRegion).toContainText('Which event would you like to boost registrations for?');
    }

    // Step 3: Find and pick event
    async findAndPickEventByName(name: string) {
        await this.page.getByRole('button', { name: 'Find Event Search existing or' }).click();
        await expect(this.page.getByRole('banner')).toContainText('Find Events');
        await this.page.getByPlaceholder('Search events by name').click();
        await this.page.getByPlaceholder('Search events by name').fill(name);
        await this.page.getByRole('button', { name: 'Upcoming SAFE at the 10th' }).first().click();
        await this.page.getByRole('button', { name: 'Continue' }).click();
        await expect(this.mainRegion).toContainText('Design your campaign and customize it for your audience');
    }

    // Step 4: Set campaign name
    async setCampaignName(name: string) {
        await this.page.getByRole('textbox', { name: 'Campaign Name' }).click();
        await this.page.getByRole('textbox', { name: 'Campaign Name' }).press('ControlOrMeta+a');
        await this.page.getByRole('textbox', { name: 'Campaign Name' }).fill(name);
    }

    // Step 5: Set campaign date to today (first date field - Start By Date)
    async setCampaignDateToday() {
        // Click the first "Calendar Start By Date" button (there are multiple on the page)
        await this.page.getByRole('button', { name: 'Calendar Start By Date' }).first().click();
        await this.page.getByRole('button', { name: 'Today', exact: true }).click();
        await this.page.getByRole('button', { name: 'Apply' }).click();
    }

    // Step 6: Set delivery date to today
    async setDeliveryDateToday() {
        await this.page.getByRole('button', { name: 'Calendar Delivery By Date' }).click();
        await this.page.getByRole('button', { name: 'Today' }).click();
        await this.page.getByRole('button', { name: 'Apply' }).click();
    }

    // Step 7: Open recipients section
    async openRecipients() {
        await this.page.locator('div').filter({ hasText: 'Recipients' }).nth(5).click();
        await expect(this.mainRegion).toContainText('Select a contact list to use for this campaign');
    }

    // Step 8: Choose contact list by name
    async chooseContactListByName(listName: string) {
        await this.page.locator('div').filter({ hasText: /^Select a contact list\.\.\.$/ }).nth(1).click();
        await this.page.locator('div').filter({ hasText: new RegExp(`^${listName}`) }).first().click();
    }

    // Step 9: Select recipients (exact codegen sequence)
    async selectRecipients() {
        await this.page.locator('.relative.flex.shrink-0').first().click();
        await this.page.locator('.flex.items-end > .flex.items-start > .relative').first().click();
        await this.page.locator('.relative.flex.shrink-0.cursor-pointer.appearance-none.items-center.justify-center.bg-primary').first().click();
        await expect(this.mainRegion).toContainText('2 individuals, 1 contact list');
    }

    // Step 10: Choose gift mode - One for All
    async chooseGiftModeOneForAll() {
        await this.page.getByText('GiftOne Gift for All • No').click();
        await expect(this.page.locator('h2')).toContainText('Select Gift Mode');
        await expect(this.mainRegion).toContainText('One Gift for All');
        await expect(this.mainRegion).toContainText('Select a Gift for All Recipients');
    }

    // Step 11: Browse and pick gift
    async browseGiftAndPick(search: string, title: string) {
        await this.page.getByRole('button', { name: 'Browse More Gifts' }).click();
        await expect(this.mainRegion).toContainText('Manage Gifts - Delight Collection', { timeout: 20000 });

        const searchBox = this.page.getByRole('textbox', { name: 'Search gifts...' });
        await searchBox.click();
        await searchBox.fill(search);

        // Tap scroll area to dismiss any overlays
        await this.page.locator('.flex-grow.overflow-auto').first().click({ position: { x: 5, y: 5 } }).catch(() => { });

        // Wait for and click the gift heading
        const heading = this.page.getByRole('heading', { name: title }).first();
        await heading.waitFor({ state: 'visible', timeout: 30000 });
        await heading.scrollIntoViewIfNeeded();

        // Try to click the parent card for better reliability
        const card = heading.locator('xpath=ancestor::div[contains(@class, "relative")]').first();
        try {
            await card.click({ position: { x: 10, y: 10 }, timeout: 3000 });
        } catch {
            await heading.focus({ timeout: 500 });
            await this.page.keyboard.press('Enter');
        }

        await this.page.getByRole('button', { name: 'Confirm Selection' }).click();
        await expect(this.mainRegion).toContainText(title);
    }

    // Step 12: Set gift link expiry to today
    async setGiftLinkExpiryToday() {
        // Look for the date button in the Gift section (after "Gift Link Expiry Date" text)
        const giftSection = this.page.locator('div').filter({ hasText: /Gift Link Expiry Date/i });
        const expiryButton = giftSection.getByRole('button', { name: /Calendar|Start By Date/i }).first();
        await expiryButton.click();
        await this.page.getByRole('button', { name: 'Today' }).first().click();
        await this.page.getByRole('button', { name: 'Apply' }).click();
    }

    // Step 13: Expand personalization section with clicking the arrow
    async expandPersonalization() {
        await this.page.locator('.cursor-pointer.rounded-full.bg-tertiary').click();
    }

    // Step 14: Set personalization message
    async personalizeAndSave(message: string) {
        await this.page.getByText('PersonalizationCustom message').click();
        await expect(this.mainRegion).toContainText('Gift Message');
        await this.page.getByText('🎁 Surprise! We\'ve got').click();
        await this.page.getByRole('textbox', { name: 'Type your message...' }).click();
        await this.page.getByRole('textbox', { name: 'Type your message...' }).press('ControlOrMeta+a');
        await this.page.getByRole('textbox', { name: 'Type your message...' }).fill(message);
        await this.page.getByRole('button', { name: 'Save', exact: true }).click();
    }

    // Step 15: Open gifting analytics
    async openGiftingAnalytics() {
        await this.page.locator('div').filter({ hasText: 'Gifting Analytics' }).nth(5).click();
        // Wait for tabs to be visible
        await this.page.waitForTimeout(1000);
    }

    // Step 16: Switch to Landing Page tab
    async switchToLandingPage() {
        await this.page.getByRole('tab', { name: 'Landing Page' }).click();
        await expect(this.mainRegion).toContainText('Customize Landing Page Design');
    }

    // Step 17: Set landing page content
    async setLandingContent(text: string) {
        await this.page.getByRole('button', { name: 'Content' }).click();
        await this.page.getByRole('textbox', { name: 'Enter description...' }).click();
        await this.page.getByRole('textbox', { name: 'Enter description...' }).press('ControlOrMeta+a');
        await this.page.getByRole('textbox', { name: 'Enter description...' }).fill(text);
    }

    // Step 18: Set event date to today
    async setEventDateToday() {
        await this.page.getByRole('button', { name: 'Calendar Event Date' }).click();
        await this.page.getByRole('button', { name: 'Today' }).click();
        await this.page.getByRole('button', { name: 'Apply' }).click();
    }

    // Step 19: Set media video
    async setMediaVideo(url: string) {
        await this.page.getByRole('button', { name: 'Media' }).click();
        await this.page.getByRole('tab', { name: 'Video' }).click();
        await this.page.getByRole('textbox', { name: 'Enter video URL' }).click();
        await this.page.getByRole('textbox', { name: 'Enter video URL' }).press('ControlOrMeta+a');
        await this.page.getByRole('textbox', { name: 'Enter video URL' }).fill(url);
    }

    // Step 20: Set action buttons
    async setActionButtons(primaryLabel: string, primaryUrl: string, secondaryLabel: string, secondaryUrl: string) {
        await this.page.getByRole('button', { name: 'Action Buttons' }).click();

        // Primary button - use the template-style locators
        const primary = this.page.getByText('Primary Button').locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
        const primaryInputs = primary.getByRole('textbox');
        await primaryInputs.nth(0).click();
        await primaryInputs.nth(0).press('ControlOrMeta+a');
        await primaryInputs.nth(0).fill(primaryLabel);

        await primaryInputs.nth(1).click();
        await primaryInputs.nth(1).press('ControlOrMeta+a');
        await primaryInputs.nth(1).fill(primaryUrl);

        // Secondary button
        const secondary = this.page.getByText('Secondary Button').locator('xpath=ancestor::div[contains(@class,"rounded")][1]');
        const secondaryInputs = secondary.getByRole('textbox');
        await secondaryInputs.nth(0).click();
        await secondaryInputs.nth(0).press('ControlOrMeta+a');
        await secondaryInputs.nth(0).fill(secondaryLabel);

        await secondaryInputs.nth(1).click();
        await secondaryInputs.nth(1).press('ControlOrMeta+a');
        await secondaryInputs.nth(1).fill(secondaryUrl);
    }

    // Step 21: Toggle email templates
    async toggleEmailTemplates() {
        await this.page.getByText('Email Templates5 of 5 email').click();
        await this.page.getByRole('button', { name: 'Turn off' }).nth(4).click();
        await this.page.getByRole('button', { name: 'Turn off' }).nth(4).click();
    }

    // Step 22: Launch campaign
    async launch() {
        await this.page.getByRole('button', { name: 'Launch Campaign' }).click();
        await this.page.getByRole('heading', { name: 'Campaign Launched!' }).click();
        await this.page.getByRole('link', { name: 'View Campaign Details' }).click();
        await expect(this.mainRegion).toContainText('select recipients to assign to team members');
    }
}
