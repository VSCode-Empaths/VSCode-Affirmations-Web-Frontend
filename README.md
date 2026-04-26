## VS Code Affirmations (web frontend)

This repo is the browser client for **Error Affirmations**: sign in (email/password or GitHub OAuth), then create and list personal affirmations against the backend API (`api-config.js` points at the deployed Fly.io service).

### Run locally

There is no `package.json` on `main` yet (it may land in a separate PR). Until then, serve the tree as static files:

- **VS Code:** install the “Live Server” extension, then “Open with Live Server” on `index.html`, or
- **CLI:** `npx --yes live-server` from the repo root (or any static server on the project folder).

Use a real `http://localhost` origin so cookies and fetches behave like production.

### Tests (QUnit)

CI installs runtime deps with `npm i eslint esm jsdom` and runs `npx qunit test/index.js`. Match that locally:

```bash
npm i esm jsdom
npx qunit test/index.js
```

When a `package.json` is added, prefer `npm test` if it is wired to the same command.

### Lint (ESLint 8)

```bash
npx eslint@8 . --ext .js
```

Same as CI’s `npx eslint .` after devDependencies exist. Until `package.json` exists, use `eslint@8` explicitly so the version matches CI.

---

## The Golden Rule:

🦸 🦸‍♂️ `Stop starting and start finishing.` 🏁

If you work on more than one feature at a time, you are guaranteed to multiply your bugs and your anxiety.

## Making a plan

1. **Make a drawing of your app. Simple "wireframes"**
1. **Once you have a drawing, name the HTML elements you'll need to realize your vision**
1. **For each HTML element ask: Why do I need this?**
1. **Once we know _why_ we need each element, think about how to implement the "Why" as a "How"**
1. **Find all the 'events' (user clicks, form submit, on load etc) in your app. Ask one by one, "What happens when" for each of these events. Does any state change?**
1. **Think about how to validate each of your features according to a Definition of Done**
1. **Consider what features _depend_ on what other features. Use this dependency logic to figure out what order to complete tasks.**

Additional considerations:

-   Ask: which of your HTML elements need to be hard coded, and which need to be dynamically generated?
-   Consider your data model.
    -   What kinds of objects (i.e., Dogs, Friends, Todos, etc) will you need?
    -   What are the key/value pairs?
    -   What arrays might you need?
    -   What needs to live in a persistence layer?
-   Is there some state we need to initialize?
-   Ask: should any of this work be abstracted into functions? (i.e., is the work complicated? can it be reused?)
