const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    // Step one: shipping info
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.zipInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');

    // Step two: overview
    this.finishButton = page.locator('#finish');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.totalLabel = page.locator('.summary_total_label');

    // Step three: confirmation
    this.completeHeader = page.locator('.complete-header');
  }

  async fillShippingInfo({ firstName, lastName, zip }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipInput.fill(zip);
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async getConfirmationText() {
    return this.completeHeader.textContent();
  }
}

module.exports = { CheckoutPage };
