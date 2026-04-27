/**
 * Assemble a `public/` tree for Netlify. Many Netlify projects (and UI defaults) use
 * "Publish directory" = public/; if the app only lives at the repo root, the published
 * site is empty → 404 on every path. This build makes `public/` a full copy of the app.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const out = join(root, 'public');

const files = ['index.html', 'app.js', 'api-config.js', 'fetch-utils.js'];
const dirs = ['styles', 'assets', 'auth', 'creator-page', 'lib'];

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const f of files) {
    const p = join(root, f);
    if (!existsSync(p)) {
        console.error(`Missing required file: ${f}`);
        process.exit(1);
    }
    cpSync(p, join(out, f));
}

for (const d of dirs) {
    const p = join(root, d);
    if (!existsSync(p)) {
        console.error(`Missing required dir: ${d}`);
        process.exit(1);
    }
    cpSync(p, join(out, d), { recursive: true });
}

const smoke = ['index.html', 'app.js', 'styles/reset.css', 'auth/index.html'];
for (const rel of smoke) {
    const p = join(out, rel);
    if (!existsSync(p)) {
        console.error(`Smoke check failed: ${rel}`);
        process.exit(1);
    }
}

console.log(`Netlify bundle ready: ${out}`);
