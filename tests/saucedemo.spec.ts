import { test, expect } from '@playwright/test';
import { UserFactory } from '../src/factories/UserFactory';
import { AddressFactory } from '../src/factories/AddressFactory';
import { EdgeCaseGenerator } from '../src/core/EdgeCaseGenerator';
import { SecurityPayloads } from '../src/core/SecurityPayloads';

test.describe('SauceDemo E2E with QA Test Data Generator', () => {
  const userFactory = new UserFactory();
  const addressFactory = new AddressFactory();

  test.beforeEach(async ({ page }) => {
    // 1. Navigate to SauceDemo
    await page.goto('https://www.saucedemo.com/');

    // 2. Login with valid test credentials
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // Verify successful login to inventory
    await expect(page).toHaveURL(/.*inventory.html/);

    // 3. Add first item to cart and proceed to checkout
    await page.locator('.inventory_item button').first().click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });

  test('Test Case 1: Happy path checkout using dynamic synthetic data', async ({ page }) => {
    // Generate fresh, realistic user and address data
    const syntheticUser = userFactory.build();
    const syntheticAddress = addressFactory.build();

    const [firstName, ...lastNames] = syntheticUser.fullName.split(' ');
    const lastName = lastNames.join(' ') || 'Tester';

    console.log(`Testing with dynamic user: ${firstName} ${lastName}, Zip: ${syntheticAddress.postalCode}`);

    // Fill checkout form with generated data
    await page.locator('[data-test="firstName"]').fill(firstName);
    await page.locator('[data-test="lastName"]').fill(lastName);
    await page.locator('[data-test="postalCode"]').fill(syntheticAddress.postalCode);
    await page.locator('[data-test="continue"]').click();

    // Verify progression to step two overview
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await page.locator('[data-test="finish"]').click();

    // Verify order completion
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('Test Case 2: Boundary test with max-length string', async ({ page }) => {
    // Generate 300-character boundary strings
    const longFirstName = EdgeCaseGenerator.boundaryString(150, 'A');
    const longLastName = EdgeCaseGenerator.boundaryString(150, 'B');
    const boundaryZip = '99999-9999';

    await page.locator('[data-test="firstName"]').fill(longFirstName);
    await page.locator('[data-test="lastName"]').fill(longLastName);
    await page.locator('[data-test="postalCode"]').fill(boundaryZip);
    await page.locator('[data-test="continue"]').click();

    // Application should not crash or throw unhandled exceptions
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });

  test('Test Case 3: Internationalization (i18n) & Unicode text in checkout', async ({ page }) => {
    const unicode = EdgeCaseGenerator.unicodePayloads();

    // Use RTL (Arabic) for first name and surrogate pair emojis for last name
    await page.locator('[data-test="firstName"]').fill(unicode.rtl);
    await page.locator('[data-test="lastName"]').fill(unicode.surrogatePairEmoji);
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('.complete-header')).toBeVisible();
  });

  test('Test Case 4: Security input fuzzing (SQL Injection & XSS Payloads)', async ({ page }) => {
    const sqli = SecurityPayloads.sqlInjection()[0]; // "' OR '1'='1"
    const xss = SecurityPayloads.xssPayloads()[0];  // "<script>alert('XSS')</script>"

    let dialogAppeared = false;
    page.on('dialog', async (dialog) => {
      dialogAppeared = true;
      await dialog.dismiss();
    });

    await page.locator('[data-test="firstName"]').fill(xss);
    await page.locator('[data-test="lastName"]').fill(sqli);
    await page.locator('[data-test="postalCode"]').fill('00000');
    await page.locator('[data-test="continue"]').click();

    // Assert that no alert dialog was triggered (XSS neutralized)
    expect(dialogAppeared).toBe(false);
  });
});
