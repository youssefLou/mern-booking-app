import {test, expect} from "@playwright/test"
import path from "path"

const UI_URL = 'http://localhost:5173/';


test.beforeEach(async ({page})=>{
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
})


test("should allow user to add a hotel ",async({page})=>{
    await page.goto(`${UI_URL}add-hotel`)

    await page.locator('[name="name"]').fill("test Hotel")
    await page.locator('[name="city"]').fill("test city")
    await page.locator('[name="country"]').fill("test Country")
    await page.locator('[name="description"]').fill("test this is a description for the test Hotel")
    await page.locator('[name="pricePerNight"]').fill(" 100")
    await page.selectOption('select[name = "starRating"]',"3")

    await page.getByText("Budget").click();

    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();

    await page.locator('[name = "adultCount"]').fill("2")
    await page.locator('[name = "childCount"]').fill("4")

    await page.setInputFiles('[name = "imageFiles"]',[
        path.join(__dirname,"files","1.png")
    ])

await page.getByRole('button', {name:"save"}).click()

await expect (page.getByText("Hotel Saved!")).toBeVisible()
})