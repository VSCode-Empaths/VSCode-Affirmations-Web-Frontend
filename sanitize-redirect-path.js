/**
 * Restrict post-login redirect targets to a same-origin path (no open redirects).
 * @param {string | null | undefined} raw
 * @returns {string}
 */
export function sanitizeRedirectPath(raw) {
    if (raw === null || raw === undefined || raw === '') {
        return '/';
    }
    const s = String(raw).trim();
    if (s === '') {
        return '/';
    }
    if (s.startsWith('//') || /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)/.test(s) || s.startsWith('\\')) {
        return '/';
    }
    if (!s.startsWith('/')) {
        return '/';
    }
    return s;
}
