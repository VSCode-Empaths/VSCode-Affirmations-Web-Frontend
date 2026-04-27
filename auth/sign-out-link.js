import { signOutUser } from '../fetch-utils.js';

// If there is a sign out link, call the API to clear the session cookie, then go to /auth
const signOutLink = document.getElementById('sign-out-link');
if (signOutLink) {
    signOutLink.addEventListener('click', (e) => {
        e.preventDefault();
        signOutUser();
    });
}
