import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4200';

test.describe('Basic Mocking Examples', () => {
  test.describe('Tour of Heroes app', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
    });

    test('loads the dashboard and shows the app title', async ({ page }) => {
      await expect(page).toHaveTitle(/Tour of Heroes/);
      await expect(page.getByRole('heading', { name: 'Top Heroes' })).toBeVisible();
    });

    test('navigates to the heroes page', async ({ page }) => {
      await page.getByRole('link', { name: 'Heroes' }).click();

      await expect(page).toHaveURL(/\/heroes$/);
      await expect(page.getByRole('heading', { name: 'My Heroes' })).toBeVisible();
    });

    test('adds a new hero to the list', async ({ page }) => {
      await page.getByRole('link', { name: 'Heroes' }).click();
      await page.locator('#new-hero').fill('Test Hero');
      await page.getByRole('button', { name: 'Add hero' }).click();

      await expect(page.getByRole('link', { name: /Test Hero/i })).toBeVisible();
    });

    test('searches for a hero', async ({ page }) => {
      await page.getByRole('link', { name: 'Dashboard' }).click();
      await page.getByRole('textbox').fill('Magneta');

      const searchResults = page.locator('#search-component').getByRole('link', { name: /Magneta/i });
      await expect(searchResults).toBeVisible();
    });

    test("edits a hero name", async ({ page }) => {
      await page.locator("a:nth-of-type(2)").click()
      await page.locator("li:nth-of-type(1) > a").click()
      await page.locator("app-hero-detail div:nth-of-type(2)").click()

      await page.locator("#hero-name").clear();
      await page.locator("#hero-name").fill("Renamed Hero");
      await page.locator("button:nth-of-type(2)").click()

      await expect(page.getByRole('link', { name: /Renamed Hero/i })).toBeVisible();
    });

    test('deletes a hero from the list', async ({ page }) => {
      await page.goto(`${BASE_URL}/heroes`);
      await expect(page.getByRole('link', { name: 'Dr. Nice' })).toBeVisible();
      await page.getByRole('listitem').filter({ hasText: 'Dr. Nice x' }).getByRole('button').click();
      await expect(page.getByRole('link', { name: 'Dr. Nice' })).toBeHidden();
    });


  });

})
