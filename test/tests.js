import { sanitizeSameSitePath } from '../lib/same-site-redirect.js';

const test = QUnit.test;

test('sanitizeSameSitePath keeps normal paths', (expect) => {
    expect.strictEqual(sanitizeSameSitePath('/'), '/');
    expect.strictEqual(sanitizeSameSitePath('/dashboard'), '/dashboard');
    expect.strictEqual(sanitizeSameSitePath('/a/b'), '/a/b');
});

test('sanitizeSameSitePath falls back for open redirects', (expect) => {
    expect.strictEqual(sanitizeSameSitePath('//evil.com/foo'), '/');
    expect.strictEqual(sanitizeSameSitePath('https://evil.com'), '/');
    expect.strictEqual(sanitizeSameSitePath('javascript:alert(1)'), '/');
});

test('sanitizeSameSitePath uses default for empty and non-strings', (expect) => {
    expect.strictEqual(sanitizeSameSitePath('', '/home'), '/home');
    expect.strictEqual(sanitizeSameSitePath('   ', '/home'), '/home');
    expect.strictEqual(sanitizeSameSitePath(null, '/x'), '/x');
    expect.strictEqual(sanitizeSameSitePath(undefined, '/x'), '/x');
});

test('sanitizeSameSitePath rejects colon and backslash in path only', (expect) => {
    expect.strictEqual(sanitizeSameSitePath('/a:b', '/d'), '/d');
    expect.strictEqual(sanitizeSameSitePath('/a\\b', '/d'), '/d');
    expect.strictEqual(
        sanitizeSameSitePath('/ok?u=http%3A%2F%2Fexample', '/d'),
        '/ok?u=http%3A%2F%2Fexample'
    );
});
