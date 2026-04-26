import { sanitizeRedirectPath } from '../sanitize-redirect-path.js';

const test = QUnit.test;

test('sanitizeRedirectPath allows safe path and defaults', (expect) => {
    expect.equal(sanitizeRedirectPath(null), '/');
    expect.equal(sanitizeRedirectPath(undefined), '/');
    expect.equal(sanitizeRedirectPath(''), '/');
    expect.equal(sanitizeRedirectPath('   '), '/');
    expect.equal(sanitizeRedirectPath('/profile'), '/profile');
    expect.equal(sanitizeRedirectPath('/a/b?c=1'), '/a/b?c=1');
});

test('sanitizeRedirectPath blocks open redirects and schemes', (expect) => {
    expect.equal(sanitizeRedirectPath('//evil.example/phish'), '/');
    expect.equal(sanitizeRedirectPath('https://evil.example'), '/');
    expect.equal(sanitizeRedirectPath('javascript:alert(1)'), '/');
    expect.equal(sanitizeRedirectPath('foo/bar'), '/');
});
