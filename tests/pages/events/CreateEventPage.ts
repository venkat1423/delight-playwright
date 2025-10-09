import { Page, Locator } from '@playwright/test';

export class CreateEventPage {
    readonly page: Page;
    readonly eventsLink: Locator;
    readonly addEventButton: Locator;
    readonly eventUrlInput: Locator;
    readonly eventNameInput: Locator;
    readonly autoFillButton: Locator;
    readonly statusButton: Locator;
    readonly startCalendarButton: Locator;
    readonly endCalendarButton: Locator;
    readonly applyButton: Locator;
    readonly expectedAttendees: Locator;
    readonly createEventButton: Locator;
    readonly mainRegion: Locator;

    constructor(page: Page) {
        this.page = page;
        this.eventsLink = page.getByRole('link', { name: 'Events' });
        this.addEventButton = page.getByRole('button', { name: '+ Add Event' });
        this.eventUrlInput = page.getByRole('textbox', { name: 'https://example.com/event' });
        this.eventNameInput = page.getByRole('textbox', { name: 'Event Name *' });
        this.autoFillButton = page.getByRole('button', { name: 'Auto-Fill' });
        this.statusButton = page.getByRole('button', { name: /Event Status/i });
        this.startCalendarButton = page.getByRole('button', { name: /Start Date & Time/i });
        this.endCalendarButton = page.getByRole('button', { name: /End Date & Time/i });
        this.applyButton = page.getByRole('button', { name: 'Apply' });
        this.expectedAttendees = page.getByRole('spinbutton', { name: 'Expected Attendees' });
        this.createEventButton = page.getByRole('button', { name: '+ Create Event' });
        this.mainRegion = page.getByRole('main');
    }

    async openEventsList() {
        await this.eventsLink.click();
    }

    async openCreateForm() {
        await this.addEventButton.click();
    }

    async pasteEventUrl(url: string) {
        await this.eventUrlInput.fill(url);

        // Auto-fill is important - wait for it to complete before proceeding
        console.log('Starting auto-fill process - waiting for completion');
        await this.autoFillButton.click();
        await this.waitForAutoFillCompletion();
        console.log('Auto-fill completed successfully - proceeding with test');
    }

    private async waitForAutoFillCompletion() {
        // Wait for auto-fill to complete with longer timeout
        const maxWaitTime = 60000; // 60 seconds - give auto-fill plenty of time
        const start = Date.now();

        console.log('Waiting for auto-fill to complete...');

        while (Date.now() - start < maxWaitTime) {
            // Check if page is still open
            if (this.page.isClosed()) {
                throw new Error('Page was closed during auto-fill process');
            }

            // Check if auto-fill button is still in "Auto-Filling" state
            try {
                const autoFillButton = this.page.getByRole('button', { name: 'Auto-Filling' });
                const isAutoFilling = await autoFillButton.isVisible({ timeout: 2000 });

                if (!isAutoFilling) {
                    // Auto-fill completed, check if we got content
                    if (!this.page.isClosed()) {
                        await this.page.waitForTimeout(3000); // Wait longer for content to populate
                        const eventName = await this.eventNameInput.inputValue();
                        if (eventName && eventName.trim()) {
                            console.log('Auto-fill completed successfully with content:', eventName);
                            return; // Success - auto-fill worked
                        }
                    }
                    throw new Error('Auto-fill completed but no content was populated');
                }

                // Still auto-filling, wait and check again
                console.log('Auto-fill still in progress...');
                if (!this.page.isClosed()) {
                    await this.page.waitForTimeout(2000); // Wait longer between checks
                }

            } catch (error) {
                // Button not found or timeout - check if we got content
                if (!this.page.isClosed()) {
                    await this.page.waitForTimeout(3000); // Wait longer for content to populate
                    const eventName = await this.eventNameInput.inputValue();
                    if (eventName && eventName.trim()) {
                        console.log('Auto-fill completed successfully with content:', eventName);
                        return; // Success - auto-fill worked
                    }
                }
                throw new Error('Auto-fill failed to populate content');
            }
        }

        throw new Error('Auto-fill timed out after 60 seconds');
    }

    private async fillFormManually(url: string) {
        // Check if page is still open before manual filling
        if (this.page.isClosed()) {
            console.log('Page was closed, cannot proceed with manual filling');
            throw new Error('Page was closed');
        }

        // Manual filling with realistic data
        try {
            console.log('Filling form manually with realistic data');
            await this.eventNameInput.fill('SAFE at the 10th Annual FAIR Institute Conference');
            await this.page.getByRole('textbox', { name: 'Organizer / Host' }).fill('SAFE Security');
            await this.page.getByRole('textbox', { name: 'Event Description *' }).fill('Come meet us November 4–5 in New York City at the 10th Annual FAIR Institute Conference — where the future of risk management is being rewritten with Agentic AI.');
            await this.page.getByRole('textbox', { name: 'Venue *' }).fill('New York City');
            await this.page.getByRole('textbox', { name: 'Physical Address *' }).fill('New York City');
            await this.page.getByRole('textbox', { name: 'Event Website URL' }).fill(url);
            console.log('Manual form filling completed successfully');
        } catch (error) {
            console.log('Manual form filling failed:', error instanceof Error ? error.message : 'Unknown error');
            if (this.page.isClosed()) {
                console.log('Page was closed during manual filling');
                throw new Error('Page was closed during manual form filling');
            }
            throw error;
        }
    }

    private async waitForAutoFillToStop() {
        // Wait for auto-fill button to stop being disabled with reasonable timeout
        try {
            await this.page.waitForFunction(
                () => {
                    const button = document.querySelector('button[disabled]');
                    return !button?.textContent?.includes('Auto-Filling');
                },
                { timeout: 15000 } // 15 seconds timeout
            );
            console.log('Auto-fill stopped, proceeding with manual filling');
        } catch (error) {
            console.log('Auto-fill wait timed out, proceeding anyway');
        }

        // Wait a bit more for form to be fully enabled - but only if page is still open
        if (!this.page.isClosed()) {
            await this.page.waitForTimeout(1000);
        }
    }

    async setStatus(statusLabel: string) {
        if (this.page.isClosed()) {
            console.log('Page was closed before setting status');
            return;
        }

        try {
            await this.statusButton.click();
            await this.page.getByRole('option', { name: statusLabel }).locator('div').nth(1).click();
        } catch (error) {
            console.log('Status setting failed:', error instanceof Error ? error.message : 'Unknown error');
            if (this.page.isClosed()) {
                console.log('Page was closed during status setting');
                return;
            }
            throw error;
        }
    }

    async pickDates(startDayAria: string, endDayAria: string) {
        // Check page validity before starting
        if (this.page.isClosed()) {
            throw new Error('Page was closed before date selection');
        }

        try {
            // Start date selection
            await this.startCalendarButton.click();
            const startDialog = this.page.getByRole('dialog', { name: 'Calendar Start Date & Time' });
            await startDialog.waitFor({ state: 'visible', timeout: 10000 });

            // Check if the specific date button exists
            const startDateButton = startDialog.getByRole('button', { name: startDayAria });
            await startDateButton.waitFor({ state: 'visible', timeout: 5000 });
            await startDateButton.click();

            await startDialog.getByRole('button', { name: 'Apply' }).click();
            await startDialog.waitFor({ state: 'hidden', timeout: 5000 });

            // Check page validity before end date selection
            if (this.page.isClosed()) {
                throw new Error('Page was closed after start date selection');
            }

            // End date selection
            await this.endCalendarButton.click();
            const endDialog = this.page.getByRole('dialog', { name: 'Calendar End Date & Time' });
            await endDialog.waitFor({ state: 'visible', timeout: 10000 });

            // Check if the specific date button exists
            const endDateButton = endDialog.getByRole('button', { name: endDayAria });
            await endDateButton.waitFor({ state: 'visible', timeout: 5000 });
            await endDateButton.click();

            await endDialog.getByRole('button', { name: 'Apply' }).click();
            await endDialog.waitFor({ state: 'hidden', timeout: 5000 });

        } catch (error) {
            console.log('Date selection failed:', error instanceof Error ? error.message : 'Unknown error');
            // If page is closed, don't throw - just log and continue
            if (this.page.isClosed()) {
                console.log('Page was closed during date selection, continuing...');
                return;
            }
            throw error;
        }
    }

    async setExpectedAttendeesCount(count: number) {
        if (this.page.isClosed()) {
            console.log('Page was closed before setting attendees count');
            return;
        }

        try {
            await this.expectedAttendees.fill(String(count));
        } catch (error) {
            console.log('Attendees count setting failed:', error instanceof Error ? error.message : 'Unknown error');
            if (this.page.isClosed()) {
                console.log('Page was closed during attendees count setting');
                return;
            }
            throw error;
        }
    }

    async submit() {
        if (this.page.isClosed()) {
            console.log('Page was closed before submitting');
            return;
        }

        try {
            await this.createEventButton.click();
        } catch (error) {
            console.log('Submit failed:', error instanceof Error ? error.message : 'Unknown error');
            if (this.page.isClosed()) {
                console.log('Page was closed during submit');
                return;
            }
            throw error;
        }
    }

    async waitForEventsListLoaded(expectedSnippet?: string, timeoutMs: number = 10000) {
        await this.mainRegion.waitFor({ state: 'visible', timeout: timeoutMs });
        if (!expectedSnippet) return;
        const text = (await this.mainRegion.textContent()) || '';
        if (!text.includes(expectedSnippet)) {
            throw new Error(`Expected events list to include text: "${expectedSnippet}"`);
        }
    }
}


