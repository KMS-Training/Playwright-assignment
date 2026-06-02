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