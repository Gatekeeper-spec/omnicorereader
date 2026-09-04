#!/usr/bin/env node
/**
 * Vercel serverless chunks sometimes `import … from "tslib"` without shipping
 * the package next to `_libs/*.mjs`. Rewrite those imports to a vendored copy
 * that lives beside the chunks (not in node_modules, which Vercel may skip).
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FUNC = join(ROOT, ".vercel/output/functions/__server.func");
const LIBS = join(FUNC, "_libs");
const TSLIB_SRC = join(ROOT, "node_modules/tslib/tslib.es6.mjs");
const TSLIB_DEST = join(LIBS, "tslib.mjs");

if (!existsSync(FUNC) || !existsSync(TSLIB_SRC)) {
  console.log("[patch-tslib] nothing to patch");
  process.exit(0);
}

mkdirSync(LIBS, { recursive: true });
copyFileSync(TSLIB_SRC, TSLIB_DEST);

function walk(dir, acc = []) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) walk(p, acc);
    else if (name.name.endsWith(".mjs") || name.name.endsWith(".js")) acc.push(p);
  }
  return acc;
}

let patched = 0;
for (const file of walk(FUNC)) {
  if (file === TSLIB_DEST) continue;
  const src = readFileSync(file, "utf8");
  if (!src.includes('from "tslib"') && !src.includes("from 'tslib'")) continue;
  let rel = relative(dirname(file), TSLIB_DEST).replaceAll("\\", "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  const next = src
    .replaceAll('from "tslib"', `from "${rel}"`)
    .replaceAll("from 'tslib'", `from '${rel}'`);
  if (next !== src) {
    writeFileSync(file, next);
    patched += 1;
  }
}
console.log(`[patch-tslib] vendored tslib.mjs and rewrote ${patched} file(s)`);
