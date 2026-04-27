/* Imports */
import './auth/user.js';

import { createAffirmation, fetchAffirmations } from './fetch-utils.js';

/** Display labels for `category_id` from GET /api/v1/categories (values on `<select name="category">`). */
const CATEGORY_LABELS = {
    1: 'Daily',
    2: 'Error',
    3: 'TDD',
    4: 'Will to go on',
};

/* Get DOM Elements */
const addAffirmationForm = document.getElementById('add-affirmation-form');
const submitButton = document.getElementById('submit-button');
const affirmationList = document.getElementById('affirmation-list');
const errorDisplay = document.getElementById('error-display');

/* State */
let affirmations = [];
let error = null;

/* Events */
window.addEventListener('load', async () => {
    affirmations = [];
    const result = await fetchAffirmations();
    if (!result.ok) {
        error = { message: result.message };
        displayError();
        return;
    }
    error = null;
    affirmations = Array.isArray(result.data) ? result.data : [];
    displayError();
    displayAffirmations();
});

addAffirmationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    try {
        error = null;
        displayError();
        const formData = new FormData(addAffirmationForm);
        const text = formData.get('text');
        const category_id = formData.get('category');
        const result = await createAffirmation(text, category_id);
        if (!result.ok) {
            error = { message: result.message };
            displayError();
            return;
        }
        affirmations.unshift(result.data);
        displayAffirmations();
        addAffirmationForm.reset();
    } finally {
        submitButton.disabled = false;
    }
});
/* Display Functions */
function displayAffirmations() {
    affirmationList.innerHTML = '';
    for (const affirmation of affirmations) {
        if (!affirmation) {
            continue;
        }
        const li = document.createElement('li');
        const h3 = document.createElement('p');
        const p = document.createElement('p');
        h3.textContent = affirmation.text;
        const id = affirmation.category_id;
        p.textContent =
            CATEGORY_LABELS[id] || affirmation.category || id || '—';
        li.append(h3, p);
        affirmationList.append(li);
    }
}

function displayError() {
    errorDisplay.textContent = error ? error.message : '';
}
