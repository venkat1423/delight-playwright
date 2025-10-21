import { test, expect } from '../../fixtures/baseFixtures';
import { getValidLoginCreds, uniqueName } from '../../utils/helpers';
import { getLatestEventName, saveLatestEventName } from '../../utils/eventStore';

test('All Events list interactions @events @regression', async ({ pages }) => {
    await pages.loginPage.goto();
    const { email, password } = getValidLoginCreds();
    await pages.loginPage.login(email, password);

    await pages.allEventsPage.gotoList();
    await expect(pages.allEventsPage.mainRegion).toBeVisible();
    await pages.allEventsPage.selectMyEvents();
    await pages.allEventsPage.selectAllEvents();
    let latest = getLatestEventName();
    if (!latest) {
        // Create a minimal event to ensure we have one to assert
        await pages.createEventPage.openCreateForm();
        latest = uniqueName('Event');
        await pages.createEventPage.setEventName(latest);
        await pages.createEventPage.setEventType('Webinar');
        await pages.createEventPage.setStatus('Upcoming');
        await pages.createEventPage.pickDates('Friday, October 10,', 'Monday, October 20,');
        await pages.createEventPage.setExpectedAttendeesCount(20);
        await pages.createEventPage.submit();
        await pages.createEventPage.waitForEventsListLoaded();
        saveLatestEventName(latest);
        await pages.allEventsPage.gotoList();
    }

    await pages.allEventsPage.search(latest);
    await expect(pages.allEventsPage.page.getByRole('heading', { name: latest })).toBeVisible();
});


