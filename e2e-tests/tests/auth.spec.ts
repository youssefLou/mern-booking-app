import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173/';

test('should allow the user to sign in', async ({ page }) => {
  await page.route('http://localhost:8080/api/auth/login', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ message: 'Sign in Successful!' }),
    });
  });

  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole('link', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  await page.locator('[name=email]').fill('1@1.com');
  await page.locator('[name=password]').fill('password123');

  await page.getByRole('button', { name: 'Log In' }).click();

  await expect(page.getByText('Sign in successfull')).toBeVisible();
/*
  await expect(page.getByRole('link', { name: 'My Bookings' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'my hotels' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();*/
});
test("should allow user to register", async ({ page }) => {
  const testEmail = `test_register_${Math.floor(Math.random() * 90000) + 10000}@test.com`
  await page.route('http://localhost:8080/api/users/register', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ message: 'register Successful!' }),
    });
  });

  
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmpassword]").fill("password123");

  await page.getByRole("button", { name: "Creat Account" }).click();

  await expect(page.getByText("Registration Success!")).toBeVisible();
/*  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();*/
});