import { test, expect } from '../../fixtures/baseFixtures';
import { config } from '../../utils/config';
import { getValidLoginCreds, uniqueName } from '../../utils/helpers';

test('create contact list and import CSV @regression @contacts @functionality', async ({ pages }) => {
    const login = pages.loginPage;
    const contacts = pages.contactListsPage;

    await login.goto();
    const { email, password } = getValidLoginCreds();
    await login.login(email, password); // waits for redirect and main visible

    await contacts.gotoFromAnyPage();
    await expect(contacts.mainRegion).toContainText('Manage your contact lists and audience segments');

    await contacts.openCreateDialog();
    const listName = uniqueName('New-List');
    const tags = [uniqueName('tag'), uniqueName('tag'), uniqueName('tag'), uniqueName('tag')];
    await contacts.createList(listName, tags);
    await contacts.waitForListDetail(listName);
    await expect(pages.page.getByRole('heading', { name: listName })).toBeVisible();

    // Open the newly created list so Import is available on the detail view
    await contacts.openListByName(listName);

    await contacts.openImportDialog();
    await expect(pages.page.getByLabel('Import from CSV').locator('section')).toContainText('Upload a CSV file with your contact data.');
    await contacts.importFromCsv(config.csvPath);

    // Close the Import dialog before navigating back
    await pages.page.getByRole('button', { name: 'Close' }).click();

    // Navigate back using the in-app control rather than a hardcoded list ID
    await contacts.backToLists();

    // Refresh the page to ensure clean state
    await pages.page.reload();

    // Test completed successfully - no logout needed as it closes the session
});


