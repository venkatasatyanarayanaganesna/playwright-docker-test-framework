const { test, expect } = require('../../fixtures/pageObjectFixtures');
const { PRODUCTS } = require('../../utils/testData');

test.describe('Products page', () => {
  // Uses the `authenticatedPage` fixture — already logged in, no boilerplate.
  test('adding a product updates the cart badge @smoke', async ({ authenticatedPage }) => {
    await authenticatedPage.addToCartByName(PRODUCTS.BACKPACK);
    expect(await authenticatedPage.getCartCount()).toBe(1);
  });

  test('adding multiple products accumulates the badge count @regression', async ({ authenticatedPage }) => {
    await authenticatedPage.addToCartByName(PRODUCTS.BACKPACK);
    await authenticatedPage.addToCartByName(PRODUCTS.BIKE_LIGHT);
    await authenticatedPage.addToCartByName(PRODUCTS.BOLT_SHIRT);

    expect(await authenticatedPage.getCartCount()).toBe(3);
  });

  test('sorting by price low to high orders products correctly @regression', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('lohi');
    const prices = await authenticatedPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
  });

  test('sorting by name Z to A orders products correctly @regression', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('za');
    const names = await authenticatedPage.getProductNames();
    const sorted = [...names].sort().reverse();

    expect(names).toEqual(sorted);
  });

  // --- Network interception & mocking ---
  test('inventory renders an empty state gracefully when API/data call fails @regression', async ({
    page,
    authenticatedPage,
  }) => {
    // Simulate a failed backend response for inventory data to verify the
    // UI degrades gracefully instead of crashing. Sauce Demo is static, so this
    // demonstrates the *pattern* — point the route at your real API endpoint.
    await page.route('**/inventory.json', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    );

    // Reload to trigger the (mocked) request path.
    await page.reload();

    // The page itself should still render without throwing.
    await expect(page.locator('.title')).toBeVisible();
  });
});
