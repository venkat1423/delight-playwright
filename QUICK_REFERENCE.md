# 🚀 Quick Reference Guide - DelightLoop Playwright Tests

## 📋 **File Quick Reference**

| File | Purpose | Key Functions |
|------|---------|---------------|
| `package.json` | Project config & scripts | `npm test`, `npm run test:headed` |
| `playwright.config.ts` | Test runner settings | Browser config, parallel execution |
| `tsconfig.json` | TypeScript settings | Type checking, path aliases |
| `tests/fixtures/baseFixtures.ts` | Custom test fixtures | Provides `pages` fixture |
| `tests/pages/PageFactory.ts` | Page object factory | Creates all page objects |
| `tests/utils/config.ts` | Configuration | `baseUrl`, `csvPath` |
| `tests/utils/helpers.ts` | Helper functions | `getValidLoginCreds()`, `uniqueName()` |
| `test-data/users.json` | Test user data | Login/register credentials |
| `test-data/TestList3.csv` | Contact test data | CSV import testing |

## 🎯 **Page Objects Quick Reference**

### **LoginPage**
```typescript
await pages.loginPage.goto()                    // Navigate to login
await pages.loginPage.login(email, password)    // Login with credentials
```

### **RegisterPage**
```typescript
await pages.registerPage.goto()                 // Navigate to register
await pages.registerPage.register(fn, ln, email, pwd)  // Register user
```

### **CreateEventPage**
```typescript
await pages.createEventPage.openEventsList()           // Go to events
await pages.createEventPage.openCreateForm()           // Open create form
await pages.createEventPage.pasteEventUrl(url)         // Fill URL & auto-fill
await pages.createEventPage.setStatus('Upcoming')      // Set status
await pages.createEventPage.pickDates(start, end)      // Pick dates
await pages.createEventPage.setExpectedAttendeesCount(55)  // Set attendees
await pages.createEventPage.submit()                   // Submit form
```

### **ContactListsPage**
```typescript
await pages.contactListsPage.gotoFromAnyPage()         // Go to contact lists
await pages.contactListsPage.openCreateDialog()        // Open create dialog
await pages.contactListsPage.createList(name, tags)    // Create list
await pages.contactListsPage.openImportDialog()       // Open import dialog
await pages.contactListsPage.importFromCsv(path)       // Import CSV
```

## 🔧 **Common Commands**

```bash
# Install & Setup
npm install
npm run test:install

# Run Tests
npm test                           # Run all tests
npm run test:headed               # Run with visible browser
npm run test:ui                   # Run with UI mode
npm run test:debug                # Debug mode

# Run Specific Tests
npm test tests/e2e/auth/login.spec.ts
npm test tests/e2e/events/createEvent.spec.ts

# View Results
npm run test:report               # Open HTML report
```

## 🎨 **Test Structure Template**

```typescript
import { test, expect } from '../fixtures/baseFixtures';
import { getValidLoginCreds } from '../utils/helpers';

test('Test description', async ({ pages }) => {
  // 1. Setup/Login
  await pages.loginPage.goto();
  const { email, password } = getValidLoginCreds();
  await pages.loginPage.login(email, password);
  
  // 2. Navigate to feature
  await pages.featurePage.goto();
  
  // 3. Perform actions
  await pages.featurePage.performAction();
  
  // 4. Assertions
  await expect(pages.featurePage.element).toBeVisible();
});
```

## 🛠️ **Helper Functions**

```typescript
// Get valid login credentials
const { email, password } = getValidLoginCreds();

// Generate unique names
const uniqueName = uniqueName('prefix');  // "prefix-1234567890-123"

// Configuration
config.baseUrl    // Website URL
config.csvPath    // CSV file path
```

## 🎯 **Element Finding Patterns**

```typescript
// Recommended - By role
page.getByRole('button', { name: 'Sign in' })
page.getByRole('textbox', { name: 'Email *' })
page.getByRole('heading', { name: 'Welcome' })

// By text
page.getByText('Welcome to Dashboard')

// By label
page.getByLabel('Email Address')

// By placeholder
page.getByPlaceholder('Enter your email')
```

## ✅ **Assertion Patterns**

```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Text content
await expect(element).toContainText('Welcome');
await expect(element).toHaveText('Exact text');

// Values
await expect(input).toHaveValue('test@example.com');
await expect(input).toBeEmpty();

// URLs
await expect(page).toHaveURL(/\/dashboard/);
await expect(page).toHaveTitle('Dashboard');

// Count
await expect(list).toHaveCount(5);
```

## ⏱️ **Wait Strategies**

```typescript
// Wait for element state
await element.waitFor({ state: 'visible' });
await element.waitFor({ state: 'hidden' });
await element.waitFor({ state: 'attached' });

// Wait for URL
await page.waitForURL(/\/dashboard/);

// Wait for timeout
await page.waitForTimeout(1000);

// Wait for function
await page.waitForFunction(() => document.readyState === 'complete');
```

## 🚨 **Error Handling Patterns**

```typescript
// Try-catch for fallback
try {
  await autoFillButton.click();
  await waitForAutoFillCompletion();
} catch (error) {
  console.log('Auto-fill failed, using manual fallback');
  await fillFormManually();
}

// Check page state
if (this.page.isClosed()) {
  throw new Error('Page was closed');
}

// Graceful logout
try {
  await this.page.goto(`${config.baseUrl}/logout`);
} catch (error) {
  console.log('Logout completed - page may have been closed');
}
```

## 📊 **Test Data Patterns**

```typescript
// From JSON file
import users from '../../test-data/users.json';
for (const data of users.login.positive) {
  test(`should login: ${data.email}`, async ({ pages }) => {
    // Use data.email, data.password
  });
}

// Dynamic data
const email = data.email.replace('{{ts}}', String(Date.now()));
const listName = uniqueName('Test-List');
```

## 🎯 **Best Practices Checklist**

- ✅ Use descriptive test names
- ✅ Use page objects for all interactions
- ✅ Use proper wait strategies (not fixed timeouts)
- ✅ Handle errors gracefully
- ✅ Use data-driven testing
- ✅ Keep tests independent
- ✅ Use environment variables for config
- ✅ Add proper assertions
- ✅ Clean up after tests
- ✅ Use TypeScript for type safety

## 🔍 **Debugging Tips**

```typescript
// Add console logs
console.log('Starting test: User can create event');

// Use debug mode
npm run test:debug

// Take screenshots on failure
await page.screenshot({ path: 'debug.png' });

// Pause execution
await page.pause();

// View trace
npx playwright show-trace test-results/path-to-trace.zip
```

## 🚀 **Quick Start Checklist**

1. ✅ Install dependencies: `npm install`
2. ✅ Install browsers: `npm run test:install`
3. ✅ Check config: Verify `config.ts` settings
4. ✅ Run sample test: `npm test tests/e2e/auth/login.spec.ts`
5. ✅ View results: `npm run test:report`
6. ✅ Start developing: Follow test structure template

---

**💡 Pro Tip**: Keep this guide handy while developing tests. It contains all the common patterns and functions you'll need!
