import { API_BASE } from './api-config.js';

const JSON_HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
};

/**
 * Derive reasonable display names from the email local-part so sign-up can send
 * firstName/lastName without extra form fields (backend expects these fields).
 * @param {string} email
 * @returns {{ firstName: string, lastName: string }}
 */
function displayNamesFromEmail(email) {
    const raw = String(email || '').split('@')[0].trim();
    const local = raw || 'user';
    const tokens = local.split(/[-._+]+/).filter(Boolean);
    const title = (s) =>
        s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
    if (tokens.length >= 2) {
        return {
            firstName: title(tokens[0]),
            lastName: title(tokens.slice(1).join(' ')),
        };
    }
    const one = tokens[0] || local;
    return { firstName: title(one), lastName: '' };
}

/**
 * @typedef {{ ok: true, data: * }} FetchOk
 * @typedef {{ ok: false, message: string, status?: number }} FetchErr
 * UI-safe result for affirmation helpers: success carries payload in `data`, failure in `message`.
 */

/**
 * Read response: verify res.ok, parse JSON when present, tolerate non-JSON error bodies.
 * @param {Response} res
 * @returns {Promise<FetchOk|FetchErr>}
 */
async function readResponse(res) {
    const text = await res.text();
    let body = null;
    if (text) {
        try {
            body = JSON.parse(text);
        } catch (parseErr) {
            body = { message: text };
        }
    }
    if (!res.ok) {
        const message =
            (body &&
                (body.message ||
                    (typeof body.error === 'string'
                        ? body.error
                        : body.error && body.error.message))) ||
            res.statusText ||
            'Request failed';
        return { ok: false, message, status: res.status, data: body };
    }
    return { ok: true, data: body };
}

/* Auth related functions */
export async function getUser() {
    try {
        const resp = await fetch(`${API_BASE}/api/v1/users/me`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const result = await readResponse(resp);
        if (!result.ok) {
            return undefined;
        }
        return result.data;
    } catch (e) {
        return undefined;
    }
}

export async function signUpUser(email, password) {
    try {
        const { firstName, lastName } = displayNamesFromEmail(email);
        const resp = await fetch(`${API_BASE}/api/v1/users`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ email, password, firstName, lastName }),
            credentials: 'include',
        });
        const result = await readResponse(resp);
        if (!result.ok) {
            return { error: { message: result.message } };
        }
        return result.data;
    } catch (e) {
        return { error: { message: (e && e.message) || 'Network error' } };
    }
}

export async function signInUser(email, password) {
    try {
        const resp = await fetch(`${API_BASE}/api/v1/users/sessions`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });
        const result = await readResponse(resp);
        if (!result.ok) {
            return { error: { message: result.message } };
        }
        return result.data;
    } catch (e) {
        return { error: { message: (e && e.message) || 'Network error' } };
    }
}

export async function signOutUser() {
    try {
        const resp = await fetch(`${API_BASE}/api/v1/users/sessions`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (resp.ok) {
            location.replace('/auth/');
        }
    } catch (e) {
        // optional: could surface; sign-out is best-effort
    }
}

/* Data functions */
export async function fetchAffirmations() {
    try {
        const res = await fetch(`${API_BASE}/api/v1/affirmations`, {
            method: 'GET',
            headers: JSON_HEADERS,
            credentials: 'include',
        });
        return await readResponse(res);
    } catch (e) {
        return { ok: false, message: (e && e.message) || 'Network error' };
    }
}

/**
 * POST /api/v1/affirmations — body matches backend: { text: string, category_id: string }.
 * category_id is the string id from GET /api/v1/categories (e.g. "1" for daily).
 */
export async function createAffirmation(text, category_id) {
    try {
        const res = await fetch(`${API_BASE}/api/v1/affirmations`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ text, category_id }),
            credentials: 'include',
        });
        return await readResponse(res);
    } catch (e) {
        return { ok: false, message: (e && e.message) || 'Network error' };
    }
}

export async function deleteAffirmation(id) {
    try {
        const res = await fetch(`${API_BASE}/api/v1/affirmations/${id}`, {
            method: 'DELETE',
            headers: JSON_HEADERS,
            credentials: 'include',
        });
        return await readResponse(res);
    } catch (e) {
        return { ok: false, message: (e && e.message) || 'Network error' };
    }
}
