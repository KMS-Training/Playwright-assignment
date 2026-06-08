import { Page } from '@playwright/test';

export class InventoryPage {
    constructor(protected page: Page) {}

    elements = {
        sortDropdown: () => this.page.locator('select.product_sort_container'),
        productCards: () => this.page.locator('.inventory_item'),
        productName: (name: string) => this.page.locator('.inventory_item_name', { hasText: name }),
        productCardByName: (name: string) => this.page.locator('.inventory_item').filter({ hasText: name }),
        cartBadge: () => this.page.locator('.shopping_cart_badge'),
        addToCartButtonById: (id: string) => this.page.locator(`#add-to-cart-${id}`),
        removeButtonById: (id: string) => this.page.locator(`#remove-${id}`),
        addToCartButtons: () => this.page.locator('button[data-test^="add-to-cart"]'),
        productImages: () => this.page.locator('img.inventory_item_img'),
        productPriceByName: (name: string) => this.page.locator('.inventory_item').filter({ hasText: name }).locator('.inventory_item_price'),
    };

    async selectSort(value: string) {
        await this.elements.sortDropdown().selectOption(value);
    }

    async getSortValue(): Promise<string> {
        return this.elements.sortDropdown().inputValue();
    }

    async getProductNames(): Promise<string[]> {
        return this.page.locator('.inventory_item_name').allTextContents();
    }

    async addToCartByName(name: string) {
        await this.elements.productCardByName(name).locator('button').click();
    }

    async removeFromCartByName(name: string) {
        await this.elements.productCardByName(name).locator('button').click();
    }

    async getCartCount(): Promise<number> {
        const count = await this.elements.cartBadge().textContent();
        return count ? parseInt(count, 10) : 0;
    }

    async getPricesList(): Promise<string[]> {
        return this.page.locator('.inventory_item_price').allTextContents();
    }

    async getImageByAltPartial(partial: string) {
        return this.page.locator(`img[alt*="${partial}"]`);
    }
}
