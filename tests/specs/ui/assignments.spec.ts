// import { test } from 'src/fixtures/base.fixture';
import Env from "settings/env/env.global";
import { test } from "settings/fixtures/ui.fixture";
import { expect } from "@playwright/test";

test("Check 'Sign In' page", async ({ signInPage }) => {
    // Given the user is on the Sign In page (handled by the signInPage fixture)
    // When the user logs in using the shared signInPage helper
    await signInPage.login(Env.USERNAME, Env.PASSWORD);
});

test("Scenario 1: Default sort state after login", async ({ signInPage, page }) => {
    // Given: user logs in with valid credentials
    await signInPage.login(Env.USERNAME, Env.PASSWORD);

    // Then: inventory page should be shown
    await expect(page).toHaveURL(/inventory.html/);

    // And: the sort dropdown defaults to "Name (A to Z)" (data value 'az')
    const sort = page.locator('select.product_sort_container');
    await expect(sort).toHaveValue('az');

    // And: products are listed in alphabetical order
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    expect(productNames).toEqual([
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)'
    ]);
});

test("Scenario 2: Sort resets after logout and re-login", async ({ signInPage, page }) => {
    // Given: user is logged in and on the inventory page
    await signInPage.login(Env.USERNAME, Env.PASSWORD);

    // Then: inventory page should be shown
    await expect(page).toHaveURL(/inventory.html/);

    // When: user selects "Name (Z to A)"
    const sortDropdown = page.locator('select.product_sort_container');
    await sortDropdown.selectOption('za');
    await expect(sortDropdown).toHaveValue('za');

    // And: user opens hamburger menu and logs out
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();

    // Then: app returns to the site root (login entry point)
    await expect(page).toHaveURL(Env.WEB_URL);

    // When: user logs back in
    await signInPage.login(Env.USERNAME, Env.PASSWORD);
    await expect(page).toHaveURL(/inventory.html/);

    // Then: sort should be reset to default 'az'
    await expect(sortDropdown).toHaveValue('az');

    // And: products are again in ascending alphabetical order
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    expect(productNames).toEqual([
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt',
        'Sauce Labs Fleece Jacket',
        'Sauce Labs Onesie',
        'Test.allTheThings() T-Shirt (Red)'
    ]);
});

test("Scenario 3: Sort works correctly with items in cart and equal-price products maintain stable order", async ({ signInPage, page }) => {
    // Given: user is logged in and on the inventory page
    await signInPage.login(Env.USERNAME, Env.PASSWORD);
    await expect(page).toHaveURL(/inventory.html/);

    // Locate the product cards for Backpack and Onesie
    const backpackCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    const onesieCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Onesie' });

    // When: add both items to cart
    await backpackCard.locator('button').click();
    await onesieCard.locator('button').click();

    // Then: cart badge updates to show 2 items
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // When: sort by Price (high to low)
    const sortDropdown = page.locator('select.product_sort_container');
    await sortDropdown.selectOption('hilo');
    await expect(sortDropdown).toHaveValue('hilo');

    // Then: product prices are ordered descending
    const priceTextsDesc = await page.locator('.inventory_item_price').allTextContents();
    expect(priceTextsDesc).toEqual(['$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99']);

    // And: cart badge still shows 2
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // And: the two added items now show "Remove"
    await expect(backpackCard.locator('button')).toHaveText('Remove');
    await expect(onesieCard.locator('button')).toHaveText('Remove');

    // And: remaining products still have "Add to cart" buttons (count 4)
    await expect(page.locator('button', { hasText: 'Add to cart' })).toHaveCount(4);

    // When: sort by Price (low to high)
    await sortDropdown.selectOption('lohi');
    await expect(sortDropdown).toHaveValue('lohi');

    // Then: for equal-price products ($15.99) verify stable order is preserved
    const lowToHighNames = await page.locator('.inventory_item_name').allTextContents();
    const lowToHighRanks = lowToHighNames.filter(name => ['Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)'].includes(name));
    expect(lowToHighRanks).toEqual(['Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)']);

    // When: switch back to high-to-low and verify stable order remains
    await sortDropdown.selectOption('hilo');
    await expect(sortDropdown).toHaveValue('hilo');

    const highToLowNames = await page.locator('.inventory_item_name').allTextContents();
    const highToLowRanks = highToLowNames.filter(name => ['Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)'].includes(name));
    expect(highToLowRanks).toEqual(['Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)']);
});