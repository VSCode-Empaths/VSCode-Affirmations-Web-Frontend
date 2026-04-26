import { getUser, signOutUser } from '../fetch-utils.js';
newGetUser();
// make sure we have a user!
async function newGetUser() {
    const user = await getUser();
    if (!user) {
        // redirect to /auth page, passing along where the user was redirected _from_
        location.replace(`/auth/?redirectUrl=${encodeURIComponent(location)}`);
    }
}

// If there is a sign out link, call the API to clear the session cookie, then go to /auth
const signOutLink = document.getElementById('sign-out-link');
if (signOutLink) {
    signOutLink.addEventListener('click', () => {
        signOutUser();
    });
}
