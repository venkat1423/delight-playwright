import { Page } from '@playwright/test';
import { RegisterPage } from './auth/RegisterPage';
import { LoginPage } from './auth/LoginPage';
import { CreateEventPage } from './events/CreateEventPage';
import { ContactListsPage } from './contacts/ContactListsPage';

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
}
