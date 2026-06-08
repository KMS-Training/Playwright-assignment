import { test, expect } from '@playwright/test';

test('Locator verification for saucedemo', async ({ page }) => {
  // Login
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/inventory.html/);

  // 1. Shopping cart link/icon
  await expect(page.locator('a.shopping_cart_link')).toHaveCount(1);

  // 2. All "Add to cart" buttons (at least one)
  expect(await page.locator('button.btn_inventory').count()).toBeGreaterThan(0);

  // 3. Sort dropdown
  await expect(page.locator('select.product_sort_container')).toHaveCount(1);

  // 4. All product images
  expect(await page.locator('img.inventory_item_img').count()).toBeGreaterThan(0);

  // 5. Items whose price contains "$15.99"
  expect(await page.locator('xpath=//div[@class="inventory_item_price" and normalize-space()="$15.99"]').count()).toBeGreaterThan(0);

  // 6. Add to cart button for "Sauce Labs Backpack"
  await expect(page.locator('button#add-to-cart-sauce-labs-backpack')).toHaveCount(1);

  // 7. Remove button for "Sauce Labs Onesie" (appear after adding)
  // add onesie then check remove
  await page.locator('button#add-to-cart-sauce-labs-onesie').click();
  await expect(page.locator('button#remove-sauce-labs-onesie')).toHaveCount(1);
  // clean up: remove it
  await page.locator('button#remove-sauce-labs-onesie').click();

  // 8. Buttons with data-test starting with add-to-cart
  expect(await page.locator('button[data-test^="add-to-cart"]').count()).toBeGreaterThan(0);

  // 9. Product names that do NOT contain "Sauce Labs" (expect at least one)
  const productNames = await page.locator('.inventory_item_name').allTextContents();
  expect(productNames.some(n => !n.includes('Sauce Labs'))).toBeTruthy();

  // 10. Product image by partial alt text
  expect(await page.locator('img[alt*="Backpack"]').count()).toBeGreaterThan(0);
});
