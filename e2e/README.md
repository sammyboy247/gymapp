# E2E Testing with Playwright

This directory contains end-to-end tests for GymApp using Playwright.

## Test Files

- `auth.spec.ts` - Authentication flows (login, logout, role-based access)
- `booking.spec.ts` - Schedule viewing and session booking
- `admin.spec.ts` - Admin features (session creation, roster, programs)
- `friends.spec.ts` - Friend system (search, requests, activity sharing)

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Debug mode (step through tests)
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## Prerequisites

Before running tests, ensure:
1. Firebase project is configured (`.env` file)
2. Seed data has been created (`npm run seed`)
3. Dev server is running (tests will start it automatically)

## Test Accounts

The tests use these accounts (created by seed script):

- **Admin:** admin@gymapp.com / Admin123!
- **Coach:** coach@gymapp.com / Coach123!
- **Member 1:** member1@gymapp.com / Member123!
- **Member 2:** member2@gymapp.com / Member123!

## Writing New Tests

Follow Playwright best practices:
- Use `data-testid` attributes for stable selectors
- Wait for elements with `waitForSelector` when needed
- Use `beforeEach` for common setup (login)
- Keep tests independent (no dependencies between tests)

## CI/CD Integration

Tests can be run in CI pipelines:
```bash
CI=true npm run test:e2e
```

See `playwright.config.ts` for configuration.
