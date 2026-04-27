import { getUser } from '../fetch-utils.js';
import './sign-out-link.js';

newGetUser();
// make sure we have a user!
async function newGetUser() {
    const user = await getUser();
    if (!user) {
        // redirect to /auth page, passing along where the user was redirected _from_
        location.replace(`/auth/?redirectUrl=${encodeURIComponent(location)}`);
    }
}
