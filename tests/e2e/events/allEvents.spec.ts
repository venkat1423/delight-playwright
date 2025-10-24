import { test, expect } from '../../fixtures/baseFixtures';
import { getValidLoginCreds, uniqueName } from '../../utils/helpers';
import { getLatestEventName, saveLatestEventName } from '../../utils/eventStore';

test('All Events list interactions @events @regression', async ({ pages }) => {
    test.setTimeout(120000); // 2 minutes

    await pages.loginPage.goto();
    const { email, password } = getValidLoginCreds();
    await pages.loginPage.login(email, password);

    await pages.allEventsPage.gotoList();
    await expect(pages.allEventsPage.mainRegion).toBeVisible();

    // Test filter tabs
    await pages.allEventsPage.selectMyEvents();
    await pages.allEventsPage.selectAllEvents();

    // Check if any events exist by looking for event headings
    const eventHeadings = pages.allEventsPage.page.getByRole('heading').filter({ hasText: /^(?!Manage|All Events|My Events|Filters).+$/ });
    const eventCount = await eventHeadings.count();

    let latest: string;

    if (eventCount === 0) {
        // No events exist, create one with all mandatory fields
        await pages.createEventPage.openCreateForm();
        latest = uniqueName('SearchTest-Event');
        await pages.createEventPage.setEventName(latest);
        await pages.createEventPage.setDescription('This is a test event created for search testing purposes');
        await pages.createEventPage.setVenue('Test Conference Center');
        await pages.createEventPage.setPhysicalAddress('123 Test Street, Test City');
        await pages.createEventPage.setEventType('Webinar');
        await pages.createEventPage.setStatus('Upcoming');
        await pages.createEventPage.pickDates('Friday, October 10,', 'Monday, October 20,');
        await pages.createEventPage.setExpectedAttendeesCount(20);
        await pages.createEventPage.submit();
        await pages.createEventPage.waitForEventsListLoaded();
        saveLatestEventName(latest);

        // Navigate back to events list
        await pages.loginPage.page.goto(`${pages.loginPage.page.url().split('/events')[0]}/events`);
        await expect(pages.allEventsPage.mainRegion).toContainText('Manage and track your events', { timeout: 15000 });
        await pages.loginPage.page.waitForTimeout(3000);

        // Search for the newly created event
        await pages.allEventsPage.search(latest);
        const searchResult = pages.allEventsPage.page.getByRole('heading', { name: latest }).first();
        await expect(searchResult).toBeVisible({ timeout: 10000 });

        // Open the searched event and verify it's the correct one
        await searchResult.click();
        await expect(pages.loginPage.page.getByRole('main')).toContainText('Edit event details and configuration', { timeout: 30000 });

        // Verify the event name in the edit form matches what we searched for
        const eventNameInput = pages.loginPage.page.locator('input[name="name"]');
        await expect(eventNameInput).toHaveValue(latest, { timeout: 10000 });
    } else {
        // Events exist, get the first event's name for search testing
        const firstEventName = await eventHeadings.first().textContent();
        latest = firstEventName?.trim() || '';

        // Search for this existing event
        await pages.allEventsPage.search(latest);
        const searchResult = pages.allEventsPage.page.getByRole('heading', { name: latest }).first();
        await expect(searchResult).toBeVisible({ timeout: 10000 });

        // Open the searched event and verify it's the correct one
        await searchResult.click();
        await expect(pages.loginPage.page.getByRole('main')).toContainText('Edit event details and configuration', { timeout: 30000 });

        // Verify the event name in the edit form matches what we searched for
        const eventNameInput = pages.loginPage.page.locator('input[name="name"]');
        await expect(eventNameInput).toHaveValue(latest, { timeout: 10000 });
    }
});


