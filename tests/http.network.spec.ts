import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4300';

test.describe('HTTP Mocking Examples', () => {

  test('should display heroes when API succeeds', async ({ page }) => {
    const mockHeroes = [
      { id: 1, name: 'Superman' },
      { id: 2, name: 'Batman' }
    ];

    await page.route('**/api/heroes', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockHeroes),
      });
    });

    await page.goto(`${BASE_URL}/heroes`);
    await expect(page.getByText('Superman')).toBeVisible();
  });

  test('should show empty heroes list when API returns no data', async ({ page }) => {
    await page.route('**/api/heroes', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto(`${BASE_URL}/heroes`);

    const heroItems = page.locator('ul.heroes li');
    await expect(heroItems).toHaveCount(0);
  });


});
