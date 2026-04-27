import { sameSiteRedirectPath } from '../lib/same-site-redirect.js';

const test = QUnit.test;

test('sameSiteRedirectPath keeps safe relative paths', (expect) => {
    expect.strictEqual(sameSiteRedirectPath('/'), '/');
    expect.strictEqual(sameSiteRedirectPath('/dashboard'), '/dashboard');
    expect.strictEqual(sameSiteRedirectPath('/a/b'), '/a/b');
});

test('sameSiteRedirectPath blocks open redirects and schemes', (expect) => {
    expect.strictEqual(sameSiteRedirectPath('//evil.com/foo'), '/');
    expect.strictEqual(sameSiteRedirectPath('https://evil.com'), '/');
    expect.strictEqual(sameSiteRedirectPath('javascript:alert(1)'), '/');
});

test('sameSiteRedirectPath null or non-string falls back to /', (expect) => {
    expect.strictEqual(sameSiteRedirectPath(null), '/');
    expect.strictEqual(sameSiteRedirectPath(''), '/');
    expect.strictEqual(sameSiteRedirectPath('   '), '/');
});

test('sameSiteRedirectPath allows query on safe path', (expect) => {
    expect.strictEqual(
        sameSiteRedirectPath('/ok?u=x'),
        '/ok?u=x'
    );
});
