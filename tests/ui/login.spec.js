const { test, expect } = require('../../fixtures/pageObjectFixtures');
const { STANDARD_USER, LOCKED_USER, PASSWORD } = require('../../utils/testData');

test.describe('Login', () => {
  test('standard user can log in successfully @smoke', async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(STANDARD_USER, PASSWORD);

    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('locked out user sees an error @regression', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(LOCKED_USER, PASSWORD);

    const error = await loginPage.getErrorText();
    expect(error).toContain('locked out');
  });

  test('empty credentials show validation error @regression', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('', '');

    const error = await loginPage.getErrorText();
    expect(error).toContain('Username is required');
  });

  test('wrong password shows generic error @regression', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(STANDARD_USER, 'wrong-password');

    const error = await loginPage.getErrorText();
    expect(error).toContain('do not match');
  });
});
