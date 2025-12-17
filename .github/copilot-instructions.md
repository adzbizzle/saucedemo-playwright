<!-- Copilot instructions for repository-specific AI coding agents -->
# Repo overview
- This is a Playwright + TypeScript test suite for the Sauce Demo sample site.
- Tests live under `tests/` (UI specs) and `tests/API/` (API specs). Page objects are in `pages/`.

# Important files
- `playwright.config.ts` — testDir, `baseURL`, reporter (`playwright-report`), CI-aware `retries`, and `use` defaults (headless, screenshots, traces).
- `package.json` — devDependencies defined but no runnable `test` script; use `npx playwright test` for test execution.
- `pages/login.page.ts` — canonical Page Object example (use `new LoginPage(page)` in tests).
- `tests/login.spec.ts` and `tests/API/get-users.spec.ts` — examples of UI and API test patterns.
- CI workflow: `.github/workflows/playwright.yml` (runs Playwright in CI; `process.env.CI` affects `retries`).

# Big picture / architecture notes
- Tests use Playwright Test runner with TypeScript page objects in `pages/`. Page objects encapsulate navigation and element actions (see `LoginPage.login()` for pattern).
- API tests use the Playwright `request` fixture (see `tests/API/get-users.spec.ts`).
- Test output is written to `playwright-report/` (HTML) and `test-results/` (raw results).

# Project-specific conventions
- Page Objects: put classes in `pages/`, export them, and instantiate in specs: `const login = new LoginPage(page)`.
- Test files: `.spec.ts` located under `tests/` (subfolders like `API/` grouped by concern).
- Prefer using `playwright.config.ts` `baseURL` (currently `https://www.saucedemo.com`) — prefer `page.goto('/')` unless the test requires a full URL. Note: some pages use absolute URLs (existing `LoginPage.goto()` uses the full URL).
- Use built-in Playwright fixtures (`page`, `request`) rather than custom global state.

# How to run locally (examples)
```
npm install
npx playwright install
npx playwright test                # run all tests (headless)
npx playwright test tests/login.spec.ts   # run a single spec
npx playwright test tests/API --headed # run API folder with headed browser when needed
npx playwright show-report playwright-report/index.html  # open HTML report
```

# Debugging & CI notes
- To debug a test interactively: `npx playwright test -p chromium --debug` or add `--headed --trace=on`.
- `playwright.config.ts` sets `retries: process.env.CI ? 1 : 0` — CI runs may retry once.
- CI workflow is at `.github/workflows/playwright.yml` — mirror that when running in CI-like environments.

# Common pitfalls the agent should watch for
- `package.json` has no `test` script; do not assume `npm test` runs Playwright tests.
- `pages/Inventory.page.ts` is currently empty — new page objects should follow the `LoginPage` style.
- Tests may rely on `baseURL` in `playwright.config.ts`; prefer relative `page.goto('/')` calls when adding new pages.

# Examples to mirror
- Import + use a page object (see `tests/login.spec.ts`):
  - `import { LoginPage } from '../pages/login.page'; const login = new LoginPage(page); await login.login('standard_user','secret_sauce');`
- API request pattern (see `tests/API/get-users.spec.ts`): `const response = await request.get('https://dummyjson.com/users'); const body = await response.json();`

# When updating this file
- Preserve CI-specific notes and `playwright.config.ts` guidance. If adding run scripts to `package.json`, update the commands section above.

---
If any section is unclear or you want me to add scripted `npm` commands or a starter `test` script in `package.json`, tell me which option you prefer and I'll update accordingly.
