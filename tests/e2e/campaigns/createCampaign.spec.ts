import { test, expect } from '../../fixtures/baseFixtures';
test.setTimeout(180_000);
import { getValidLoginCreds, uniqueName, uniqueSentence } from '../../utils/helpers';

test('Create and launch campaign with dynamic data @campaigns @regression', async ({ pages }) => {
    await pages.loginPage.goto();
    const { email, password } = getValidLoginCreds();
    await pages.loginPage.login(email, password);

    // 1) Create an event to boost using a shared method on CreateEventPage
    const eventName = await pages.createEventPage.createBasicEventAndReturnName();

    // 2) Create a contact list and import CSV
    const listName = uniqueName('List');
    await pages.contactListsPage.gotoFromAnyPage();
    await pages.contactListsPage.openCreateDialog();
    await pages.contactListsPage.createList(listName, ['tag1', 'tag2']);
    await pages.contactListsPage.waitForListDetail(listName);
    await pages.contactListsPage.openListByName(listName);
    await pages.contactListsPage.openImportDialog();
    await pages.contactListsPage.importFromCsv('test-data/contacts.csv');

    // Navigate to campaigns and open create
    await pages.allCampaignsPage.gotoList();
    await pages.allCampaignsPage.openCreateForm();

    // Goal and motion
    await pages.createCampaignPage.chooseGoalDriveEvent();
    await pages.createCampaignPage.chooseMotionBoostRegistration();

    // Pick event for boosting
    await pages.createCampaignPage.findAndPickEventByName(eventName);

    // Campaign details
    const campaignName = uniqueName('Campaign');
    await pages.createCampaignPage.setCampaignName(campaignName);
    await pages.createCampaignPage.setCampaignDateToday();
    await pages.createCampaignPage.setDeliveryDateToday();

    // Recipients
    await pages.createCampaignPage.openRecipients();
    await pages.createCampaignPage.chooseContactListByName(listName);
    await pages.createCampaignPage.selectRecipients();

    // Gift setup (One for all)
    await pages.createCampaignPage.chooseGiftModeOneForAll();
    await pages.createCampaignPage.browseGiftAndPick('envelope', 'DIY mini envelopes');
    await pages.createCampaignPage.setGiftLinkExpiryToday();

    // Personalization
    await pages.createCampaignPage.expandPersonalization();
    await pages.createCampaignPage.personalizeAndSave('this is for testing purpose');

    // Gifting Analytics & Landing Page
    await pages.createCampaignPage.openGiftingAnalytics();
    await pages.createCampaignPage.switchToLandingPage();
    await pages.createCampaignPage.setLandingContent('this is for testing purpse');
    await pages.createCampaignPage.setEventDateToday();

    // Media
    await pages.createCampaignPage.setMediaVideo('https://youtu.be/kpy6QEAuLJw?si=SxIqbOJCS7g4MfLR');

    // Action buttons
    await pages.createCampaignPage.setActionButtons('Let\'s connect', 'https://www.delightloop.com/bookademo', 'AboutMe', 'https://www.delightloop.com/');

    // Email templates
    await pages.createCampaignPage.toggleEmailTemplates();

    // Launch
    await pages.createCampaignPage.launch();
});


