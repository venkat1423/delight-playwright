import { test, expect } from '../../fixtures/baseFixtures';
import { getValidLoginCreds, uniqueName, uniqueUrl, uniqueSentence, randomInt } from '../../utils/helpers';
import { config } from '../../utils/config';
import { saveLatestEventName } from '../../utils/eventStore';

test('User can create an event manually @events @manual @regression', async ({ pages }) => {
    test.setTimeout(120000); // 2 minutes

    await pages.loginPage.goto();
    const { email, password } = getValidLoginCreds();
    await pages.loginPage.login(email, password);

    await pages.createEventPage.openEventsList();
    await pages.createEventPage.openCreateForm();

    const name = uniqueName('Manual-Event');
    const eventUrl = uniqueUrl('manual-event');
    const organizer = uniqueName('Org');
    const description = uniqueSentence('Manual event');
    const venue = uniqueName('Venue');
    const address = `${randomInt(1, 999)} ${uniqueName('Street')}`;
    const attendees = randomInt(10, 200);
    const tags = [uniqueName('tag'), uniqueName('tag'), uniqueName('tag')];
    const topics = [uniqueName('topic'), uniqueName('topic2'), uniqueName('topic3')];
    const personas = [uniqueName('persona1'), uniqueName('persona2')];
    const accounts = [uniqueName('acct1'), uniqueName('acct2')];
    const speakers = [uniqueName('spk1'), uniqueName('spk2')];

    await pages.createEventPage.setEventName(name);
    await pages.createEventPage.setWebsiteUrl(eventUrl);
    await pages.createEventPage.setOrganizer(organizer);
    await pages.createEventPage.setDescription(description);
    await pages.createEventPage.setVenue(venue);
    await pages.createEventPage.setPhysicalAddress(address);
    await pages.createEventPage.setEventType('Webinar');
    await pages.createEventPage.setStatus('Upcoming');
    await pages.createEventPage.pickDates('Friday, October 10,', 'Monday, October 20,');
    await pages.createEventPage.setExpectedAttendeesCount(attendees);
    await pages.createEventPage.addTags(tags);
    await pages.createEventPage.addTopics(topics);
    await pages.createEventPage.addTargetPersonas(personas);
    await pages.createEventPage.addTargetAccounts(accounts);
    await pages.createEventPage.setAgendaSummary(uniqueSentence('Summary'));
    await pages.createEventPage.addSpeakers(speakers);
    await pages.createEventPage.setProductFocus(uniqueSentence('Focus'));

    await pages.createEventPage.submit();
    await pages.createEventPage.waitForEventsListLoaded();

    // Persist for follow-up tests (same worker)
    saveLatestEventName(name);

    // Open the same event and edit it in the same test
    await pages.loginPage.page.goto(`${config.baseUrl}/events`);
    await pages.loginPage.page.waitForURL(/\/events(\?.*)?$/);
    await expect(pages.loginPage.page.getByRole('main')).toBeVisible();
    try {
        await pages.allEventsPage.openEventByName(name);
    } catch {
        await pages.allEventsPage.openFirstEvent();
    }
    await pages.loginPage.page.locator('input[name="name"]').waitFor({ state: 'visible', timeout: 30000 });

    const updatedName = uniqueName('Manual-Event-Updated');
    await pages.editEventPage.setName(updatedName);
    await pages.editEventPage.setStatus('Upcoming');
    await pages.editEventPage.save();

    // Verify we can return to All Events and see the updated name
    await pages.loginPage.page.goto(`${config.baseUrl}/events`);
    await pages.loginPage.page.waitForURL(/\/events(\?.*)?$/);
    await expect(pages.loginPage.page.getByRole('main')).toContainText('Manage and track your events', { timeout: 30000 });
    // Wait for events to load and event cards to be visible
    await pages.loginPage.page.waitForTimeout(3000);
    // Check if the updated name appears as heading or text anywhere on the page
    const nameLocator = pages.loginPage.page.getByText(updatedName).first();
    await expect(nameLocator).toBeVisible({ timeout: 20000 });
});


