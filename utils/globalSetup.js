const { chromium } = require('@playwright/test');
const { STANDARD_USER, PASSWORD } = require('./testData');

/**
 * Runs once before the whole suite. Logs in a single time and persists
 * the authenticated session to disk (storageState.json). Specs that need
 * a logged-in user can then load this file directly and skip the login
 * UI flow entirely — much faster than logging in inside every test.
 *
 * Wire this into playwright.config.js with:  globalSetup: require.resolve('./utils/globalSetup')
 */
module.exports = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(process.env.BASE_URL || 'https://www.saucedemo.com');
  await page.fill('#user-name', STANDARD_USER);
  await page.fill('#password', PASSWORD);
  await page.click('#login-button');
  await page.waitForURL(/inventory/);

  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
};
