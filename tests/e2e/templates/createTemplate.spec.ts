import { test, expect } from '../../fixtures/baseFixtures';
import { getValidLoginCreds, uniqueName, uniqueSentence } from '../../utils/helpers';

test('Create template with dynamic data @templates @regression', async ({ pages }) => {
    await pages.loginPage.goto();
    const { email, password } = getValidLoginCreds();
    await pages.loginPage.login(email, password);

    // Go to Templates
    await pages.allTemplatesPage.gotoList();
    await pages.allTemplatesPage.openCreateForm();

    // Start create
    const name = uniqueName('Template');
    await pages.createTemplatePage.setTemplateName(name);

    // Tags (3) - keep <=20 chars
    const shortTag = () => `tag${Math.floor(Math.random() * 10000)}`;
    await pages.createTemplatePage.addTags([shortTag(), shortTag(), shortTag()]);

    // Description
    await pages.createTemplatePage.setDescription(uniqueSentence('Template desc'));

    // Gift mode + gifts
    await pages.createTemplatePage.chooseGiftModeLetRecipientsChoose();
    await pages.createTemplatePage.openGiftsDrawerAndSearch('bottle');
    await pages.createTemplatePage.selectGiftByName('Gradient Fitness Water Bottle', 0);
    await pages.createTemplatePage.selectGiftByName('Smart Water Bottle', 1);
    await pages.createTemplatePage.confirmGiftSelection();
    await pages.createTemplatePage.toggleGiftCards([
        'Bamboo Notebook',
        'Smart Water Bottle',
        'Executive Pen Set',
    ]);

    // Personalization
    await pages.createTemplatePage.openPersonalizationAndSaveMessage(uniqueSentence('Gift message'));
    await pages.createTemplatePage.openGiftingAnalytics();

    // Content
    await pages.createTemplatePage.setLandingContent(uniqueSentence('Landing page'));

    // Date (use Today)
    await pages.createTemplatePage.setEventDateToday();

    // Media
    await pages.createTemplatePage.setVideoUrl('https://youtu.be/kpy6QEAuLJw?si=muTFWIUbKTP8WuK4');

    // Action buttons
    await pages.createTemplatePage.setActionButtons(
        'just book it', 'https://www.delightloop.com/bookademo',
        'Learn More', 'https://www.delightloop.com/'
    );

    // Email templates toggles
    await pages.loginPage.page.getByText('Email Templates', { exact: true }).click();
    await pages.loginPage.page.locator('div:nth-child(2) > .flex.items-start.justify-between > .relative').click();
    await pages.loginPage.page.locator('div:nth-child(3) > .flex.items-start.justify-between > .relative').click();

    // Create
    await pages.createTemplatePage.create();
    await expect(pages.loginPage.page.getByRole('main')).toContainText(name);
});


