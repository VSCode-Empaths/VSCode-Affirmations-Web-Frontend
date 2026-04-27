import { API_BASE } from '../../api-config.js';

const JSON_CT = { 'content-type': 'application/json' };

/**
 * Stubs the Fly API in the browser so tests do not depend on the network.
 * Fulfills /users/me, GET/POST /affirmations. Other /api/ calls get 404 JSON.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<void>}
 */
export async function installApiStubs(page) {
    await page.route(
        (url) => {
            return url.protocol === 'https:' && url.href.startsWith(`${API_BASE}/`);
        },
        async (route) => {
            const req = route.request();
            const u = new URL(req.url());
            const p = u.pathname;
            const method = req.method();

            if (p === '/api/v1/users/me' && method === 'GET') {
                return route.fulfill({
                    status: 200,
                    headers: JSON_CT,
                    body: JSON.stringify({ id: 1, email: 'e2e@local.test' }),
                });
            }
            if (p === '/api/v1/affirmations' && method === 'GET') {
                return route.fulfill({
                    status: 200,
                    headers: JSON_CT,
                    body: '[]',
                });
            }
            if (p === '/api/v1/affirmations' && method === 'POST') {
                let post = {};
                try {
                    const raw = req.postData();
                    post = raw ? JSON.parse(raw) : {};
                } catch {
                    post = {};
                }
                const row = {
                    id: 42,
                    text: String(post.text ?? ''),
                    category_id: String(post.category_id ?? '1'),
                };
                return route.fulfill({
                    status: 201,
                    headers: JSON_CT,
                    body: JSON.stringify(row),
                });
            }
            if (p === '/api/v1/users/sessions' && method === 'DELETE') {
                return route.fulfill({ status: 204 });
            }
            return route.fulfill({
                status: 404,
                headers: JSON_CT,
                body: JSON.stringify({ message: `unmocked: ${method} ${p}` }),
            });
        }
    );
}
