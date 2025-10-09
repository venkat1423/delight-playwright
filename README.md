# DelightLoop Playwright Test Suite

This repository contains end-to-end tests for the DelightLoop application using Playwright.

## 🚀 Quick Start

### Prerequisites
- Node.js (LTS version)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run test:install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

## 📁 Project Structure

```
tests/
├── e2e/                    # End-to-end tests organized by feature
│   ├── auth/               # Authentication tests
│   ├── campaigns/          # Campaign management tests
│   ├── contact-lists/      # Contact list tests
│   └── events/             # Event management tests
├── fixtures/               # Custom Playwright fixtures
├── pages/                  # Page Object Model
│   ├── auth/               # Authentication page objects
│   ├── contacts/           # Contact page objects
│   ├── events/             # Event page objects
│   └── PageFactory.ts      # Centralized page factory
├── utils/                  # Utility functions and helpers
└── test-data/              # Test data files (JSON, CSV)
```

## 🧪 Test Data

- **Credentials**: Managed in `test-data/users.json`
- **Contact Data**: CSV files in `test-data/` directory
- **Configuration**: Environment-based in `tests/utils/config.ts`

## 🔧 Configuration

### Environment Variables
Create a `.env` file for local configuration:
```bash
BASE_URL=https://your-test-environment.com
CSV_PATH=test-data/your-test-file.csv
```

### Playwright Configuration
- **Browser**: Chromium (default)
- **Parallel**: Enabled for local development
- **Retries**: 2 retries on CI
- **Trace**: Enabled on first retry

## 🏗️ Page Object Model

The test suite uses the Page Object Model pattern:

```typescript
// Using custom fixtures
import { test, expect } from '../fixtures/baseFixtures';

test('example test', async ({ pages }) => {
  await pages.loginPage.goto();
  await pages.loginPage.login(email, password);
  await pages.createEventPage.openCreateForm();
});
```

## 🚦 CI/CD

Tests run automatically on:
- Push to `main` or `master` branches
- Pull requests to `main` or `master` branches

## 📊 Test Reports

After running tests, view the HTML report:
```bash
npm run test:report
```

## 🔍 Debugging

### Debug Mode
```bash
npm run test:debug
```

### Trace Viewer
```bash
npx playwright show-trace test-results/path-to-trace.zip
```

## 📝 Best Practices

1. **Use Page Objects**: All UI interactions should go through page objects
2. **Data-Driven Tests**: Use JSON/CSV files for test data
3. **Environment Variables**: Use env vars for configuration
4. **Descriptive Names**: Use clear, descriptive test names
5. **Wait Strategies**: Use proper wait strategies (not hardcoded timeouts)

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Add proper error handling
4. Update documentation for new features
5. Ensure tests are reliable and maintainable
