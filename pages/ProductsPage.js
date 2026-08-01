const { BasePage } = require('./BasePage');

class ProductsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  addToCartByName(productName) {
    // Sauce Demo builds add-to-cart button ids from the product name.
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    return this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async addFirstNProductsToCart(n) {
    const addButtons = this.page.locator('button:has-text("Add to cart")');
    const count = Math.min(n, await addButtons.count());
    for (let i = 0; i < count; i++) {
      await addButtons.nth(0).click(); // list shrinks as buttons flip to "Remove"
    }
  }

  async sortBy(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getProductNames() {
    return this.inventoryItems.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices() {
    const priceTexts = await this.inventoryItems.locator('.inventory_item_price').allTextContents();
    return priceTexts.map((p) => parseFloat(p.replace('$', '')));
  }

  async getCartCount() {
    if (await this.cartBadge.count() === 0) return 0;
    return parseInt(await this.cartBadge.textContent(), 10);
  }

  async goToCart() {
    await this.cartLink.click();
  }
}

module.exports = { ProductsPage };
