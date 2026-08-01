# Playwright E-Commerce Test Automation Framework (Dockerized)

An end-to-end test automation framework built with **Playwright + JavaScript**,
targeting [saucedemo.com](https://www.saucedemo.com) (UI) and
[jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com) (API).
This version adds **Docker support** on top of the original framework —
run the exact same suite in a container, with zero local browser/Node
setup required.

## Why Docker matters here (and why this project exists)

"Have you run Playwright tests in Docker?" is a very common SDET
interview question, for a good reason: containerizing tests eliminates
an entire category of pain — the Node version mismatches, missing
browser binaries, and "works on my machine" issues that come up
constantly when a team relies on everyone's local environment being
identically configured. Playwright's official Docker image ships with
Node, all three browsers, and every OS dependency pre-installed, so
`docker run` produces identical results on any machine, and in CI.

## Running with Docker (recommended — zero local setup needed)

**Prerequisite:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

**Simplest way — one command, using Docker Compose:**
```bash
docker compose up --build
```
This builds the image, runs UI + API tests on Chromium, and exits. The
HTML report and test results are automatically synced to your local
`playwright-report/` and `test-results/` folders (via the volume mounts
in `docker-compose.yml`), so you can view them normally afterward:
```bash
npx playwright show-report
```
(You still need Node/npx locally just to *view* the report — the tests
themselves ran entirely inside the container.)

**Run a different command inside the container** (e.g. all browsers, or
just the BDD-style smoke tests):
```bash
docker compose run --rm tests npx playwright test --project=chromium --project=webkit --project=mobile-chrome --project=api
```

**Or without Compose, using plain Docker commands:**
```bash
docker build -t playwright-ecommerce .
docker run --rm -v ${PWD}/playwright-report:/app/playwright-report playwright-ecommerce
```

## Local (non-Docker) setup

## What this project demonstrates

| Area | Where |
|---|---|
| Page Object Model | `pages/` |
| Custom fixtures (fixture-based login) | `fixtures/pageObjectFixtures.js` |
| Multi-browser + mobile emulation | `playwright.config.js` (`projects`) |
| API testing (`request` context) | `tests/api/api.spec.js` |
| Network interception / mocking | `tests/ui/products.spec.js` |
| Visual regression testing | `tests/visual/visual.spec.js` |
| Storage state / session reuse | `utils/globalSetup.js` |
| Test tagging (`@smoke` / `@regression`) | throughout `tests/` |
| CI/CD pipeline | `.github/workflows/playwright.yml` |
| HTML + Allure reporting | `playwright.config.js` (`reporter`) |
| Environment config via `.env` | `.env.example` |
| Containerized test execution | `Dockerfile`, `docker-compose.yml` |

## Setup

```bash
npm install
npx playwright install --with-deps
cp .env.example .env
```

## Running tests

```bash
npm test                  # full suite, all browsers
npm run test:headed       # watch it run in a real browser window
npm run test:ui           # only UI tests
npm run test:api          # only API tests
npm run test:visual       # only visual regression tests
npm run test:smoke        # only @smoke tagged tests
npm run test:regression   # only @regression tagged tests
npm run test:chromium     # single browser, fastest for local dev
npm run test:mobile       # mobile viewport emulation
npm run test:debug        # step through with Playwright Inspector
npm run codegen           # record new tests by clicking through the site
```

## Reports

```bash
npm run report             # opens the Playwright HTML report
npx allure serve           # opens the Allure report (requires allure-commandline)
```

Traces for any failed/retried test are captured automatically — open one with:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Project structure

```
playwright-ecommerce-framework/
├── tests/
│   ├── ui/           # Login, products, cart & checkout flows
│   ├── api/          # Pure API tests (no browser)
│   └── visual/       # Screenshot-diff visual regression tests
├── pages/            # Page Object Model classes
├── fixtures/         # Custom Playwright test fixtures
├── utils/            # Test data, global setup (auth storage state)
├── .github/workflows/ # CI pipeline
├── playwright.config.js
└── .env.example
```

## Notes for presenting this project

1. Start with the **why**: this mirrors how a real QA/SDET team structures a
   framework — not just "a bunch of test files."
2. Walk through `pages/LoginPage.js` → show how POM keeps locators out of
   test logic, so a UI change means editing one file, not fifteen.
3. Show `fixtures/pageObjectFixtures.js` and the `authenticatedPage` fixture
   — explain how this avoids repeating login steps in every single test.
4. Run `npm run test:smoke` live, then open the HTML report.
5. Deliberately fail a test (e.g. change a locator) and show the **trace
   viewer** — this is usually the "wow" moment in interviews/demos.
6. Show the GitHub Actions workflow file and, if pushed to a repo, a green
   check run on GitHub itself.
7. Close with the API tests — shows you're not "just UI automation," you
   understand testing at multiple layers.

## Extending this

- Swap `saucedemo.com` for your own product's staging environment.
- Point the API project's `baseURL` at your real backend.
- Add a `docker-compose.yml` to run tests in a container for full CI parity.
- Add Slack/Teams webhook notification step to the CI workflow on failure.
