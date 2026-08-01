const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.removeButtons = page.locator('button:has-text("Remove")');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async removeItem(index = 0) {
    await this.removeButtons.nth(index).click();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }
}

module.exports = { CartPage };
