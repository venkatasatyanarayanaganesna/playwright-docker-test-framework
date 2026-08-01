const { test, expect } = require('../../fixtures/pageObjectFixtures');
const { PRODUCTS, SHIPPING_INFO } = require('../../utils/testData');

test.describe('Cart and checkout flow', () => {
  test('full purchase journey from product to confirmation @smoke', async ({
    authenticatedPage,
    cartPage,
    checkoutPage,
  }) => {
    await authenticatedPage.addToCartByName(PRODUCTS.BACKPACK);
    await authenticatedPage.addToCartByName(PRODUCTS.BIKE_LIGHT);
    await authenticatedPage.goToCart();

    expect(await cartPage.getItemCount()).toBe(2);

    await cartPage.goToCheckout();
    await checkoutPage.fillShippingInfo(SHIPPING_INFO);
    await checkoutPage.finishOrder();

    const confirmation = await checkoutPage.getConfirmationText();
    expect(confirmation).toContain('Thank you for your order');
  });

  test('removing an item from the cart updates the count @regression', async ({
    authenticatedPage,
    cartPage,
  }) => {
    await authenticatedPage.addToCartByName(PRODUCTS.BACKPACK);
    await authenticatedPage.addToCartByName(PRODUCTS.BIKE_LIGHT);
    await authenticatedPage.goToCart();

    await cartPage.removeItem(0);
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test('checkout requires all shipping fields @regression', async ({
    authenticatedPage,
    cartPage,
    checkoutPage,
    page,
  }) => {
    await authenticatedPage.addToCartByName(PRODUCTS.BACKPACK);
    await authenticatedPage.goToCart();
    await cartPage.goToCheckout();

    await checkoutPage.continueButton.click(); // submit with empty fields
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });
});
