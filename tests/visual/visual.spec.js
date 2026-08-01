const { test, expect } = require('../../fixtures/pageObjectFixtures');
const { STANDARD_USER, PASSWORD } = require('../../utils/testData');

/**
 * Visual regression tests. First run creates baseline screenshots under
 * tests/visual/*-snapshots/. Subsequent runs diff against that baseline
 * and fail if the UI changed unexpectedly by more than the configured
 * maxDiffPixelRatio (see playwright.config.js).
 */
test.describe('Visual regression @regression', () => {
  test('login page matches baseline', async ({ page, loginPage }) => {
    await loginPage.open();
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('products page matches baseline after login', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(STANDARD_USER, PASSWORD);
    await page.waitForURL(/inventory/);

    await expect(page).toHaveScreenshot('products-page.png', {
      mask: [page.locator('.shopping_cart_badge')], // dynamic element, exclude from diff
    });
  });

  test('cart icon matches baseline as a component-level screenshot', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(STANDARD_USER, PASSWORD);
    await page.waitForURL(/inventory/);

    const cartIcon = page.locator('.shopping_cart_link');
    await expect(cartIcon).toHaveScreenshot('cart-icon.png');
  });
});
