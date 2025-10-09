import { test as base } from '@playwright/test';
import { PageFactory } from '@pages/PageFactory';

type Fixtures = {
  pages: PageFactory;
};

export const test = base.extend<Fixtures>({
  pages: async ({ page }, use) => {
    const factory = new PageFactory(page);
    await use(factory);
  },
});

export { expect } from '@playwright/test';
