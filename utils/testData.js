// Centralized test data — swap these out for real fixtures/DB/API-seeded data
// in a production framework. Keeping them here avoids magic strings in specs.

module.exports = {
  STANDARD_USER: 'standard_user',
  LOCKED_USER: 'locked_out_user',
  PROBLEM_USER: 'problem_user',
  PERFORMANCE_USER: 'performance_glitch_user',
  PASSWORD: 'secret_sauce',

  SHIPPING_INFO: {
    firstName: 'Jane',
    lastName: 'Doe',
    zip: '94107',
  },

  PRODUCTS: {
    BACKPACK: 'Sauce Labs Backpack',
    BIKE_LIGHT: 'Sauce Labs Bike Light',
    BOLT_SHIRT: 'Sauce Labs Bolt T-Shirt',
  },
};
