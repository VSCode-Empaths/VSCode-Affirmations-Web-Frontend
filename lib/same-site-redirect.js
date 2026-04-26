/**
 * Normalize a user-supplied redirect fragment to a same-site path safe for
 * `location.replace` / `location.assign`. Rejects non-path values (protocol
 * URLs, protocol-relative //, control chars) and falls back to `defaultPath`.
 *
 * @param {unknown} raw
 * @param {string} [defaultPath='/']
 * @returns {string}
 */
export function sanitizeSameSitePath(raw, defaultPath = '/') {
    if (typeof raw !== 'string') {
        return defaultPath;
    }
    const s = raw.trim();
    if (s.length === 0) {
        return defaultPath;
    }
    if (!s.startsWith('/') || s.startsWith('//') || /[\0\r\n]/.test(s)) {
        return defaultPath;
    }
    const pathOnly = s.split(/[?#]/)[0];
    if (pathOnly.includes('\\') || pathOnly.includes(':')) {
        return defaultPath;
    }
    return s;
}
