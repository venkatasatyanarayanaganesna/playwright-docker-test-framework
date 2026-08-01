const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { STANDARD_USER, PASSWORD } = require('../utils/testData');

/**
 * Extends Playwright's base `test` with:
 *  1. Ready-to-use page object instances (no "new LoginPage(page)" boilerplate in every spec)
 *  2. An `authenticatedPage` fixture that logs in once and hands back a
 *     Products page — this is the reusable "already logged in" building block
 *     that most e-commerce tests need.
 */
exports.test = base.test.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // Fixture-based login: any test that requests `authenticatedPage`
  // automatically starts already logged in.
  authenticatedPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(STANDARD_USER, PASSWORD);
    await page.waitForURL(/inventory/);
    await use(new ProductsPage(page));
  },
});

exports.expect = base.expect;
