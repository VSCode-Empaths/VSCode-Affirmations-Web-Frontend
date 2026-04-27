import { test, expect } from '@playwright/test';
import { installApiStubs } from './api-stub.mjs';

const AFFIRMATION_TEXT = 'Playwright integration test has well over ten characters.';

test.beforeEach(async ({ page }) => {
    await installApiStubs(page);
});

test('home: shows form and empty list with mocked session and GET affirmations', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Error Affirmations/);
    await expect(page.locator('#add-affirmation-form')).toBeVisible();
    await expect(page.locator('#error-display')).toHaveText('');
    await expect(page.locator('#affirmation-list li')).toHaveCount(0);
});

test('home: submit adds affirmation to list (mocked POST)', async ({ page }) => {
    await page.goto('/');

    await page.locator('#affirmation-text').fill(AFFIRMATION_TEXT);
    await page.locator('select[name="category"]').selectOption('1');
    await page.locator('#submit-button').click();

    await expect(page.locator('#error-display')).toHaveText('');
    await expect(page.locator('#affirmation-list li')).toHaveCount(1);
    const first = page.locator('#affirmation-list li').first();
    await expect(first).toContainText(AFFIRMATION_TEXT);
    await expect(first).toContainText('Daily');
});
