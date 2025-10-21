import { Page } from '@playwright/test';
import { RegisterPage } from './auth/RegisterPage';
import { LoginPage } from './auth/LoginPage';
import { CreateEventPage } from './events/CreateEventPage';
import { ContactListsPage } from './contacts/ContactListsPage';
import { AllEventsPage } from './events/AllEventsPage';
import { EditEventPage } from './events/EditEventPage';
import { AllTemplatesPage } from './templates/AllTemplatesPage';
import { CreateTemplatePage } from './templates/CreateTemplatePage';

export class PageFactory {
  constructor(private _page: Page) { }

  get page() {
    return this._page;
  }

  get registerPage() {
    return new RegisterPage(this._page);
  }

  get loginPage() {
    return new LoginPage(this._page);
  }

  get createEventPage() {
    return new CreateEventPage(this._page);
  }

  get contactListsPage() {
    return new ContactListsPage(this._page);
  }

  get allEventsPage() {
    return new AllEventsPage(this._page);
  }

  get editEventPage() {
    return new EditEventPage(this._page);
  }

  get allTemplatesPage() {
    return new AllTemplatesPage(this._page);
  }

  get createTemplatePage() {
    return new CreateTemplatePage(this._page);
  }
}
