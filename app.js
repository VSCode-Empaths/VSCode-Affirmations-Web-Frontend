/* Imports */
import './auth/user.js';

import { createAffirmation, fetchAffirmations } from './fetch-utils.js';

/* Get DOM Elements */
const addAffirmationForm = document.getElementById('add-affirmation-form');
const submitButton = document.getElementById('submit-button');
const affirmationList = document.getElementById('affirmation-list');

/* State */
let affirmations = [];

/* Events */
window.addEventListener('load', async () => {
    affirmations = [];
    affirmations = await fetchAffirmations();
    displayAffirmations();
});

addAffirmationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;

    const formData = new FormData(addAffirmationForm);
    const text = formData.get('text');
    const category = formData.get('category');

    const response = await createAffirmation(text, category);
    affirmations.unshift(response);
    await displayAffirmations();

    addAffirmationForm.reset();
    submitButton.disabled = false;
});
/* Display Functions */
async function displayAffirmations() {
    affirmationList.innerHTML = '';
    for (let affirmation of affirmations) {
        const li = document.createElement('li');
        const h3 = document.createElement('p');
        const p = document.createElement('p');
        h3.textContent = affirmation.text;
        p.textContent = affirmation.category;
        li.append(h3, p);
        affirmationList.append(li);
    }
}
