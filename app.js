/* Imports */
import './auth/user.js';

import { createAffirmation, deleteAffirmation, fetchAffirmations, getUser } from './fetch-utils.js';

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
let currentUser = null;
let error = null;

/* Events */
window.addEventListener('load', async () => {
    affirmations = [];
    const [userResult, affirmationsResult] = await Promise.all([getUser(), fetchAffirmations()]);
    currentUser = userResult || null;
    if (!affirmationsResult.ok) {
        error = { message: affirmationsResult.message };
        displayError();
        return;
    }
    error = null;
    affirmations = Array.isArray(affirmationsResult.data) ? affirmationsResult.data : [];
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
function isOwner(affirmation) {
    if (!currentUser) return false;
    if (currentUser.login) return affirmation.github_user_id == currentUser.id;
    return affirmation.user_id == currentUser.id;
}

function displayAffirmations() {
    affirmationList.innerHTML = '';
    for (const affirmation of affirmations) {
        if (!affirmation) {
            continue;
        }
        const li = document.createElement('li');
        const textEl = document.createElement('p');
        const categoryEl = document.createElement('p');
        textEl.className = 'affirmation-item__text';
        categoryEl.className = 'affirmation-item__category';
        textEl.textContent = affirmation.text;
        const id = affirmation.category_id;
        categoryEl.textContent =
            CATEGORY_LABELS[id] || affirmation.category || id || '—';
        li.append(textEl, categoryEl);
        if (isOwner(affirmation)) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'affirmation-item__delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => handleDelete(affirmation.id, li));
            li.append(deleteBtn);
        }
        affirmationList.append(li);
    }
}

async function handleDelete(id, li) {
    const result = await deleteAffirmation(id);
    if (!result.ok) {
        error = { message: result.message };
        displayError();
        return;
    }
    affirmations = affirmations.filter((a) => a.id != id);
    li.remove();
}

function displayError() {
    errorDisplay.textContent = error ? error.message : '';
}
