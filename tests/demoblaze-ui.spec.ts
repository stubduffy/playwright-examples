import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.demoblaze.com/");
});

test.describe("DemoBlaze UI tests", () => {
  test("Should be able to login", async ({ page }) => {
    await page.getByRole("link", { name: "Log in" }).click();
    await page.locator("#loginusername").click();
    await page.locator("#loginusername").fill("username");
    await page.locator("#loginusername").press("Tab");
    await page.locator("#loginpassword").fill("password");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(
      page.getByRole("link", { name: "Welcome username" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Log out" })
    ).toBeVisible();
  });

  test("Should be able to signup", async ({ page }) => {
    await page.getByRole("link", { name: "Sign up" }).click();
    await page.locator("#sign-username").click();
    await page.locator("#sign-username").fill("username");
    await page.locator("#sign-username").press("Tab");
    await page.locator("#sign-password").fill("password");
    await page.getByRole("button", { name: "Sign up" }).click();
    page.on('dialog', dialog => {
      expect(dialog.message()).toEqual("This user already exist."); // equating this to the success case just for the demo
      dialog.accept();
    });
  });

  test("Should be able to learn about Blazemeter", async ({ page }) => {
    await page.getByRole("link", { name: "About us" }).click();
    await expect(
      page.locator("#example-video_html5_api")
    ).toBeVisible();
  });

  test("Should be able to send message to support team", async ({ page }) => {
    await page.getByRole("link", { name: "Contact" }).click();
    await page.locator("#recipient-email").click();
    await page.locator("#recipient-email").fill("something@email.com");
    await page.locator("#recipient-email").press("Tab");
    await page.getByLabel("Contact Email:").fill("To");
    await page.getByLabel("Contact Email:").click();
    await page.getByLabel("Contact Email:").fill("leonardo da vinci");
    await page
      .getByLabel("Message:")
      .fill("Why is my order taking so long to be delivered");
    page.on('dialog', dialog => {
      expect(dialog.message()).toEqual("Thanks for the message!!");
      dialog.accept();
    });
    await page.getByRole("button", { name: "Send message" }).click();
  });

  test("Should be able to add and remove items to/from the cart", async ({page}) => {
    page.on('dialog', dialog => {
      expect(dialog.message()).toEqual("Product added")
      dialog.accept()
    });

    // find and add a monitor
    await page.getByRole("link", { name: "Monitors" }).click();
    await page.getByRole("link", { name: "ASUS Full HD" }).click();
    await expect(page.getByText("$230")).toBeVisible();
    await expect(page.getByText("ASUS VS247H-P 23.6- Inch Full HD")).toBeVisible();
    await page.getByRole("link", { name: "Add to cart" }).click();
    await page.waitForTimeout(1000); 
    await page.getByRole("link", { name: "Home" }).click();

    // find and add a laptop
    await page.getByRole("link", { name: "Laptops" }).click();
    await page.getByRole("link", { name: "MacBook Pro" }).click();
    await expect(page.getByText("$1100")).toBeVisible();
    await expect(page.getByText(/^Apple has introduced/i)).toBeVisible();
    await page.getByRole("link", { name: "Add to cart" }).click();
    await page.waitForTimeout(1000);

    // go to cart
    await page.getByRole("link", { name: "Cart", exact: true }).click();
    await expect(page.getByRole("heading", {name: "Products" })).toBeVisible();
    await expect(page.getByRole("heading", {name: "Total" })).toBeVisible();
    await expect(page.getByRole("heading", {name: "1330" })).toBeVisible(); // weird that the cart doesn't show currency :-/

    // remove the laptop (MacBooks are too expensive)
    const rowLocator = page.locator('tr', {hasText: "MacBook Pro"});
    await rowLocator.getByRole("link", { name: "Delete" }).click();
    await expect(page.getByRole("heading", {name: "230" })).toBeVisible();
  });

  test("Should be able to successfully order an item", async ({page}) => {
    await page.getByRole("link", { name: "Phones" }).click();
    const HTC = /^HTC/i;
    await page.getByRole("link", { name: HTC }).click();
    await page.getByRole("link", { name: "Add to cart" }).click();
    await page.waitForTimeout(1000);
    await page.getByRole("link", { name: "Cart", exact: true }).click();
    await page.getByRole("button", { name: "Place order" }).click();
    await expect(page.locator("#name")).toBeVisible()
    await page.locator("#name").fill("username");
    await page.locator("#name").press("Tab");
    await page.locator("#country").fill("Germany");
    await page.locator("#country").press("Tab");
    await page.locator("#city").fill("Hamburg");
    await page.locator("#city").press("Tab");
    await page.locator("#card").fill("123456");
    await page.locator("#card").press("Tab");
    await page.locator("#month").fill("02");
    await page.locator("#month").press("Tab");
    await page.locator("#year").fill("2027");
    await page.locator("#year").press("Tab");
    await page.getByRole("button", { name: "Purchase" }).click();
    await expect(page.getByRole("heading", {name: "Thank you for your purchase!" })).toBeVisible();
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Ok" }).click();
    await page.waitForTimeout(1000);
    await page.getByRole("link", { name: "Cart", exact: true }).click();
    const tableBodyLocator = page.locator('tbody');
    await expect(tableBodyLocator.getByRole("row")).toHaveCount(0);
  });

  test.fail("Should not be able to buy an undefined item", async ({ page }) => {
    await page.goto("https://www.demoblaze.com/prod.html?idp_=100");
    await page.waitForTimeout(1000);
    await expect(page.getByRole("link", { name: "Add to cart" })).not.toBeVisible();
  });

  test.fail("Should not be able to place an empty order", async ({ page }) => {
    await page.getByRole("link", { name: "Cart", exact: true }).click();
    await page.getByRole("button", { name: "Place order" }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByRole("button", { name: "Purchase" })).not.toBeVisible();
  });
});
