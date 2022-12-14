const BASE_URL = 'https://error-affirmations.herokuapp.com';

/* Auth related functions */
export async function getUser() {
    const resp = await fetch(`${BASE_URL}/api/v1/users/me`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (resp.ok) {
        const user = await resp.json();
        return user;
    }
}

export async function signUpUser(email, password) {
    const resp = await fetch(`${BASE_URL}/api/v1/users`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });

    const data = await resp.json();
    if (!resp.ok) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        data.error = data.message;
    }
    return data;
}
export async function signInUser(email, password) {
    const resp = await fetch(`${BASE_URL}/api/v1/users/sessions`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });
    const data = await resp.json();
    if (!resp.ok) {
        // eslint-disable-next-line no-console
        console.error(data.message);
        data.error = data.message;
    }
    return data;
}
export async function signOutUser() {
    const resp = await fetch(`${BASE_URL}/api/v1/users/sessions`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (resp.ok) {
        location.replace('/auth');
    }
}

/* Data functions */
export async function fetchAffirmations() {
    const res = await fetch(`${BASE_URL}/api/v1/affirmations`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        // eslint-disable-next-line no-console
        console.error(data.message);
    }
}

export async function createAffirmation(text, category_id) {
    const res = await fetch(`${BASE_URL}/api/v1/affirmations`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, category_id }),
        credentials: 'include',
    });
    const data = await res.json();
    if (res.ok) {
        return data;
    } else {
        // eslint-disable-next-line no-console
        console.error(data.message);
    }
}
