# Error Affirmations (web)

Static front end for the Error Affirmations app: sign-in, add affirmations, and browse the list. It talks to the Fly-hosted API (see `api-config.js`).

## Run locally

This repo is plain HTML/CSS/JS. Serve the project root so module imports and paths resolve (opening `index.html` as a `file://` page will not work).

- **VS Code:** install the *Live Server* extension, then “Open with Live Server” on `index.html`.
- **CLI:** from the repo root, `npx serve` (or any static server) and open the URL it prints (often http://localhost:3000).

## Checks

- **ESLint (recommended):** `npx eslint@8 .`
- **Tests (QUnit + jsdom):** use **Node 18+** (QUnit 3 expects modern Node). From the repo root:

  ```bash
  nvm use 18   # if you use nvm; otherwise any Node 18+ install
  npx qunit test/index.js
  ```

  If you only have an older Node, install 18+ or run tests in CI; the QUnit suite may not run correctly on Node 16 and below.

## The Golden Rule

🦸 🦸‍♂️ *Stop starting and start finishing.* 🏁

If you work on more than one feature at a time, you are guaranteed to multiply your bugs and your anxiety.

## Making a plan

1. **Make a drawing of your app. Simple "wireframes"**
2. **Once you have a drawing, name the HTML elements you'll need to realize your vision**
3. **For each HTML element ask: Why do I need this?**
4. **Once we know *why* we need each element, think about how to implement the "Why" as a "How"**
5. **Find all the 'events' (user clicks, form submit, on load etc) in your app. Ask one by one, "What happens when" for each of these events. Does any state change?**
6. **Think about how to validate each of your features according to a Definition of Done**
7. **Consider what features *depend* on what other features. Use this dependency logic to figure out what order to complete tasks.**

Additional considerations:

- Ask: which of your HTML elements need to be hard coded, and which need to be dynamically generated?
- Consider your data model.
  - What kinds of objects (i.e. Dogs, Friends, Todos) will you need?
  - What are the key/value pairs?
  - What arrays might you need?
  - What needs to live in a persistence layer?
- Is there some state we need to initialize?
- Ask: should any of this be abstracted into functions? (Is the work complicated? Can it be reused?)
