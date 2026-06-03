// import { test } from 'src/fixtures/base.fixture';
import Env from "settings/env/env.global";
import { test } from "settings/fixtures/ui.fixture";
import { expect } from "@playwright/test";

test("Check 'Sign In' page", async ({ signInPage }) => {
    await signInPage.login(Env.USERNAME, Env.PASSWORD);
});

test("Scenario 1: Default sort state after login", async ({ signInPage, page }) => {
    await signInPage.login(Env.USERNAME, Env.PASSWORD);

    await expect(page).toHaveURL(/inventory.html/);

    const sort = page.locator('select.product_sort_container');
    await expect(sort).toHaveValue('az');

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
    await signInPage.login(Env.USERNAME, Env.PASSWORD);

    await expect(page).toHaveURL(/inventory.html/);

    const sortDropdown = page.locator('select.product_sort_container');
    await sortDropdown.selectOption('za');
    await expect(sortDropdown).toHaveValue('za');

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();

    await expect(page).toHaveURL(Env.WEB_URL);

    await signInPage.login(Env.USERNAME, Env.PASSWORD);
    await expect(page).toHaveURL(/inventory.html/);
    await expect(sortDropdown).toHaveValue('az');

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
    await signInPage.login(Env.USERNAME, Env.PASSWORD);
    await expect(page).toHaveURL(/inventory.html/);

    const backpackCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    const onesieCard = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Onesie' });

    await backpackCard.locator('button').click();
    await onesieCard.locator('button').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    const sortDropdown = page.locator('select.product_sort_container');
    await sortDropdown.selectOption('hilo');
    await expect(sortDropdown).toHaveValue('hilo');

    const priceTextsDesc = await page.locator('.inventory_item_price').allTextContents();
    expect(priceTextsDesc).toEqual(['$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99']);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    await expect(backpackCard.locator('button')).toHaveText('Remove');
    await expect(onesieCard.locator('button')).toHaveText('Remove');
    await expect(page.locator('button', { hasText: 'Add to cart' })).toHaveCount(4);

    await sortDropdown.selectOption('lohi');
    await expect(sortDropdown).toHaveValue('lohi');

    const lowToHighNames = await page.locator('.inventory_item_name').allTextContents();
    const lowToHighRanks = lowToHighNames.filter(name => ['Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)'].includes(name));
    expect(lowToHighRanks).toEqual(['Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)']);

    await sortDropdown.selectOption('hilo');
    await expect(sortDropdown).toHaveValue('hilo');

    const highToLowNames = await page.locator('.inventory_item_name').allTextContents();
    const highToLowRanks = highToLowNames.filter(name => ['Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)'].includes(name));
    expect(highToLowRanks).toEqual(['Sauce Labs Bolt T-Shirt', 'Test.allTheThings() T-Shirt (Red)']);
});