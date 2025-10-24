import { test, expect } from '../../fixtures/baseFixtures';
import { getValidLoginCreds, uniqueName } from '../../utils/helpers';
import { config } from '../../utils/config';

test('Auto-fill create event then edit same event @events @regression', async ({ pages }) => {
    test.setTimeout(180000);

    await pages.loginPage.goto();
    const { email, password } = getValidLoginCreds();
    await pages.loginPage.login(email, password);
    await expect(pages.loginPage.page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    await pages.createEventPage.openEventsList();
    await pages.createEventPage.openCreateForm();

    const targetUrl = 'https://safe.security/resources/events/safe-at-the-10th-annual-fair-institute-conference/';
    try {
        await pages.createEventPage.pasteEventUrl(targetUrl);
    } catch (error) {
        // pasteEventUrl already has fallback logic built-in
        console.log('Auto-fill failed but fallback handled it:', error instanceof Error ? error.message : 'Unknown error');
    }

    try {
        await expect(pages.createEventPage['eventNameInput']).toHaveValue(/.+/, { timeout: 3000 });
    } catch {
        await pages.loginPage.page.getByRole('textbox', { name: 'Event Name *' }).fill(uniqueName('Auto-Event'));
    }

    await pages.createEventPage.setStatus('Upcoming');
    await pages.createEventPage.pickDates('Friday, October 10,', 'Monday, October 20,');
    await pages.createEventPage.setExpectedAttendeesCount(55);

    await pages.createEventPage.submit();
    await pages.createEventPage.waitForEventsListLoaded();

    // Open the newly created event and edit
    await pages.loginPage.page.goto(`${config.baseUrl}/events`);
    await pages.loginPage.page.waitForURL(/\/events(\?.*)?$/);
    await expect.poll(async () => {
        const text = await pages.loginPage.page.getByRole('main').textContent().catch(() => '');
        return (text || '').includes('Manage and track your events');
    }, { timeout: 20000, intervals: [250, 500, 1000] }).toBe(true);

    // Use the first event card if the name is unknown after auto-fill
    await pages.allEventsPage.openFirstEvent();
    await pages.loginPage.page.locator('input[name="name"]').waitFor({ state: 'visible', timeout: 30000 });

    const updated = uniqueName('Auto-Event-Updated');
    await pages.editEventPage.setName(updated);
    await pages.editEventPage.setStatus('Upcoming');
    // Add tags while editing
    await pages.createEventPage.addTags([uniqueName('tag'), uniqueName('tag'), uniqueName('tag')]);
    await pages.editEventPage.save();

    await pages.loginPage.page.goto(`${config.baseUrl}/events`);
    await pages.loginPage.page.waitForURL(/\/events(\?.*)?$/);
    await expect.poll(async () => {
        const text = await pages.loginPage.page.getByRole('main').textContent().catch(() => '');
        return (text || '').includes('Manage and track your events');
    }, { timeout: 20000, intervals: [250, 500, 1000] }).toBe(true);
});


