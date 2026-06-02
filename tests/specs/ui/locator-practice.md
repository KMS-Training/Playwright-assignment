# Saucedemo Locator Practice

Site: https://www.saucedemo.com
Username: standard_user
Password: secret_sauce

## Locators

1. Select the shopping cart link/icon
   - CSS: `a.shopping_cart_link`
   - CSS alternative: `#shopping_cart_container a`
   - XPath: `//a[contains(@class, 'shopping_cart_link') or contains(@href, 'cart.html')]`

2. Select all "Add to cart" buttons
   - CSS: `button.btn_inventory`
   - CSS alternative: `button[data-test^="add-to-cart"]`
   - XPath: `//button[contains(@data-test, 'add-to-cart') or contains(., 'Add to cart')]`

3. Select the sort dropdown
   - CSS: `select.product_sort_container`
   - XPath: `//select[contains(@class, 'product_sort_container') or @data-test='product_sort_container']`

4. Select all product images
   - CSS: `img.inventory_item_img`
   - XPath: `//img[contains(@class, 'inventory_item_img')]`

5. Select items whose price contains "$15.99"
   - CSS: not possible using pure CSS text content matching; use a price element selector plus text filtering in code.
   - XPath: `//div[@class='inventory_item_price' and normalize-space()='$15.99']`
   - XPath full item block: `//div[contains(@class,'inventory_item')][.//div[@class='inventory_item_price' and normalize-space()='$15.99']]`

6. Select the "Add to cart" button for "Sauce Labs Backpack"
   - CSS: `button#add-to-cart-sauce-labs-backpack`
   - CSS alternative: `button[data-test='add-to-cart-sauce-labs-backpack']`
   - XPath: `//div[.//div[text()='Sauce Labs Backpack']]//button[contains(@data-test,'add-to-cart')]`

7. Select the "Remove" button after adding "Sauce Labs Onesie" to cart
   - CSS: `button#remove-sauce-labs-onesie`
   - CSS alternative: `button[data-test='remove-sauce-labs-onesie']`
   - XPath: `//div[.//div[text()='Sauce Labs Onesie']]//button[normalize-space()='Remove']`

8. Select all buttons with "data-test" starting with "add-to-cart"
   - CSS: `button[data-test^='add-to-cart']`
   - XPath: `//button[starts-with(@data-test, 'add-to-cart')]`

9. Select all product names that do NOT contain "Sauce Labs"
   - CSS: not possible using pure CSS negative text matching.
   - XPath: `//div[@class='inventory_item_name' and not(contains(., 'Sauce Labs'))]`

10. Select a product's image by matching alt text partially
    - CSS: `img[alt*='Backpack']`
    - XPath: `//img[contains(@alt, 'Backpack')]`
