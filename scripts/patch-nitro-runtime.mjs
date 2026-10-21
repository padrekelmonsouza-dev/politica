/**
 * Breaks circular imports where Rolldown runtime helpers (__commonJSMin, etc.)
 * are re-exported from createServerFn while createServerFn also imports React chunks
 * that need those helpers — causing "TypeError: __commonJSMin is not a function".
 */
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const serverDir = join(root, ".output", "server");
const runtimeRelDir = "_libs";
const runtimeFile = "rolldown-runtime.mjs";
const runtimeAbs = join(serverDir, runtimeRelDir, runtimeFile);

const RUNTIME_SOURCE = `// Shared Rolldown helpers (extracted to avoid circular chunk imports)
import { createRequire } from "node:module";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;

export var __esmMin = (fn, res, err) => () => {
  if (err) throw err[0];
  try {
    return fn && (res = fn(fn = 0)), res;
  } catch (e) {
    throw (err = [e]), e;
  }
};

export var __commonJSMin = (cb, mod) => () =>
  (mod || (cb((mod = { exports: {} }).exports, mod), (cb = null)), mod.exports);

export var __exportAll = (all, no_symbols) => {
  let target = {};
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
    });
  if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
  return target;
};

var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function")
    for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
      key = keys[i];
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: ((k) => from[k]).bind(null, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
    }
  return to;
};

export var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default")
      ? __defProp(target, "default", { value: mod, enumerable: true })
      : target,
    mod,
  )
);

export var __toCommonJS = (mod) =>
  __hasOwnProp.call(mod, "module.exports")
    ? mod["module.exports"]
    : __copyProps(__defProp({}, "__esModule", { value: true }), mod);

export var __require = /* @__PURE__ */ (() => createRequire(import.meta.url))();
`;

/** Maps createServerFn minified export aliases → runtime named exports */
const HELPER_ALIASES = {
  _: "__require",
  m: "__commonJSMin",
  y: "__toESM",
  h: "__esmMin",
  g: "__exportAll",
  v: "__toCommonJS",
};

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (p.endsWith(".mjs")) acc.push(p);
  }
  return acc;
}

function toPosix(p) {
  return p.split("\\").join("/");
}

function rewriteImport(filePath, source) {
  const importRe =
    /import\s*\{([^}]+)\}\s*from\s*["']([^"']*createServerFn[^"']*)["'];?/g;

  let changed = false;
  const next = source.replace(importRe, (full, specifiers, fromPath) => {
    const parts = specifiers.split(",").map((s) => s.trim()).filter(Boolean);
    const helperParts = [];
    const otherParts = [];

    for (const part of parts) {
      // e.g. "m as __commonJSMin" or "c as createServerFn"
      const m = part.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
      if (!m) {
        otherParts.push(part);
        continue;
      }
      const [, exported, local = exported] = m;
      if (HELPER_ALIASES[exported]) {
        helperParts.push(`${HELPER_ALIASES[exported]} as ${local}`);
      } else {
        otherParts.push(part);
      }
    }

    if (helperParts.length === 0) return full;

    changed = true;
    const relRuntime = toPosix(relative(dirname(filePath), runtimeAbs));
    const runtimeImport = `import { ${helperParts.join(", ")} } from "${
      relRuntime.startsWith(".") ? relRuntime : `./${relRuntime}`
    }";`;

    if (otherParts.length === 0) return runtimeImport;
    return `${runtimeImport}\nimport { ${otherParts.join(", ")} } from "${fromPath}";`;
  });

  return { next, changed };
}

if (!statSync(serverDir, { throwIfNoEntry: false })?.isDirectory()) {
  console.error("[patch-nitro] .output/server não encontrado. Rode o build antes.");
  process.exit(1);
}

mkdirSync(dirname(runtimeAbs), { recursive: true });
writeFileSync(runtimeAbs, RUNTIME_SOURCE, "utf8");

let patched = 0;
for (const file of walk(serverDir)) {
  if (file === runtimeAbs) continue;
  const source = readFileSync(file, "utf8");
  if (!source.includes("createServerFn")) continue;
  const { next, changed } = rewriteImport(file, source);
  if (changed) {
    writeFileSync(file, next, "utf8");
    patched += 1;
  }
}

console.log(`[patch-nitro] runtime helper isolado; ${patched} arquivo(s) corrigido(s).`);
