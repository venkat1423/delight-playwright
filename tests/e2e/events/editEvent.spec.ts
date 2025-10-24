import { test, expect } from '../../fixtures/baseFixtures';
import { getValidLoginCreds, uniqueName } from '../../utils/helpers';
import { config } from '../../utils/config';
import { getLatestEventName, saveLatestEventName } from '../../utils/eventStore';

test('Edit an existing event @events @regression', async ({ pages }) => {
    test.setTimeout(120000); // 2 minutes

    await pages.loginPage.goto();
    const { email, password } = getValidLoginCreds();
    await pages.loginPage.login(email, password);

    await pages.allEventsPage.gotoList();
    // Always create a fresh event and then open it by name
    await pages.allEventsPage.openCreateForm();
    const name = uniqueName('Event');
    await pages.createEventPage.setEventName(name);
    await pages.createEventPage.setEventType('Webinar');
    await pages.createEventPage.setStatus('Upcoming');
    await pages.createEventPage.pickDates('Friday, October 10,', 'Monday, October 20,');
    await pages.createEventPage.setExpectedAttendeesCount(10);
    await pages.createEventPage.submit();
    await pages.createEventPage.waitForEventsListLoaded();

    // Wait for the page to stabilize
    await pages.loginPage.page.waitForTimeout(2000);

    // Explicitly navigate to All Events to avoid implicit redirect timing
    await pages.loginPage.page.goto(`${config.baseUrl}/events`);
    await expect(pages.loginPage.page.getByRole('main')).toContainText('Manage and track your events', { timeout: 30000 });

    // Wait for events to load
    await pages.loginPage.page.waitForTimeout(1000);

    await pages.allEventsPage.openFirstEvent();

    // Wait for edit view to render then the name input
    await expect(pages.loginPage.page.getByRole('main')).toContainText('Edit event details and configuration', { timeout: 30000 });
    await pages.loginPage.page.locator('input[name="name"]').waitFor({ state: 'visible', timeout: 30000 });

    const updated = uniqueName('Updated-Event');
    await pages.editEventPage.setName(updated);
    await pages.editEventPage.setStatus('Upcoming');
    await pages.editEventPage.save();

    await expect(pages.editEventPage.mainRegion).toBeVisible();
    saveLatestEventName(updated);
});


