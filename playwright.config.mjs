import { defineConfig, devices } from '@playwright/test';

const port = 4321;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
    testDir: './tests/integration',
    testMatch: '**/*.spec.mjs',
    fullyParallel: true,
    retries: process.env.CI ? 1 : 0,
    use: { baseURL, trace: 'on-first-retry' },
    webServer: {
        // Static root so ``/``, ``/styles/...``, and ``/auth/...`` resolve like production.
        command: `npx serve -l ${port} .`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
