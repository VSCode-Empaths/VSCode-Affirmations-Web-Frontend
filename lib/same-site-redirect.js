/**
 * Open-redirect hardening: only same-site relative paths are allowed (must start with `/`).
 * Reject `//`, schemes, backslashes, and encoded bypasses. Used after login for `redirectUrl`.
 */
function hasAsciiControlChar(str) {
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code <= 31 || code === 127) {
            return true;
        }
    }
    return false;
}

/**
 * @param {string | null} raw
 * @returns {string}
 */
export function sameSiteRedirectPath(raw) {
    const fallback = '/';
    if (raw === null || typeof raw !== 'string') {
        return fallback;
    }

    const s = raw.trim();
    if (!s.startsWith('/') || s.startsWith('//')) {
        return fallback;
    }
    if (hasAsciiControlChar(s) || s.includes('\\')) {
        return fallback;
    }

    let decoded = s;
    for (let i = 0; i < 8; i++) {
        try {
            const next = decodeURIComponent(decoded);
            if (next === decoded) {
                break;
            }
            decoded = next;
        } catch (_e) {
            return fallback;
        }
    }

    if (!decoded.startsWith('/') || decoded.startsWith('//')) {
        return fallback;
    }
    if (decoded.includes('\\')) {
        return fallback;
    }

    const lower = decoded.toLowerCase();
    if (lower.includes('javascript:') || lower.includes('http:') || lower.includes('https:')) {
        return fallback;
    }

    return s;
}
