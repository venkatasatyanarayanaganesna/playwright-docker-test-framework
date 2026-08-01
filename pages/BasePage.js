/**
 * BasePage holds behavior shared by every page object:
 * navigation, waiting helpers, and common assertions.
 * All other page objects extend this class.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async title() {
    return this.page.title();
  }

  async waitForUrlContains(fragment) {
    await this.page.waitForURL(new RegExp(fragment));
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}

module.exports = { BasePage };
