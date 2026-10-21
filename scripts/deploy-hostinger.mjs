/**
 * Publica dist/client (build estático) na branch `hostinger` do GitHub.
 * No hPanel, o "Implante de GitHub" deve usar essa branch → public_html.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const BRANCH = "hostinger";
const MAX_FILE_BYTES = 95 * 1024 * 1024;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist", "client");
// Fora do projeto para o Vite/editor não indexarem uma segunda cópia das mídias.
const worktree = `${root}-deploy-hostinger`;

const git = (args, cwd = root) =>
  execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "inherit"], encoding: "utf8" }).trim();
const gitOk = (args, cwd = root) => {
  try {
    git(args, cwd);
    return true;
  } catch {
    return false;
  }
};

if (!existsSync(join(distDir, "index.html"))) {
  console.error("[deploy] dist/client/index.html não existe. Rode `npm run build:static` antes.");
  process.exit(1);
}

if (!existsSync(worktree)) {
  git(["worktree", "prune"]);
  if (gitOk(["fetch", "origin", BRANCH])) {
    git(["worktree", "add", "-B", BRANCH, worktree, `origin/${BRANCH}`]);
  } else {
    git(["worktree", "add", "--detach", worktree]);
    git(["checkout", "--orphan", BRANCH], worktree);
    git(["rm", "-rf", "-q", "."], worktree);
  }
}

for (const entry of readdirSync(worktree)) {
  if (entry !== ".git") rmSync(join(worktree, entry), { recursive: true, force: true });
}
cpSync(distDir, worktree, { recursive: true });

// GitHub recusa arquivos > 100 MB: ficam fora da branch (enviar pelo File Manager).
const tooLarge = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === ".git") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (st.size > MAX_FILE_BYTES) tooLarge.push(relative(worktree, p).split("\\").join("/"));
  }
})(worktree);

writeFileSync(
  join(worktree, ".gitignore"),
  [
    "videos/defesa/*.mp4",
    "downloads/**/*.mp4",
    "downloads/**/*.psd",
    "downloads/**/*.psb",
    "downloads/**/*.ai",
    "downloads/**/*.eps",
    ...tooLarge.map((p) => `/${p}`),
    "",
  ].join("\n"),
);

git(["add", "-A"], worktree);
if (gitOk(["diff", "--cached", "--quiet"], worktree)) {
  console.log("[deploy] Nada mudou desde o último deploy.");
  process.exit(0);
}

git(["commit", "-q", "-m", `Deploy estático ${new Date().toISOString()}`], worktree);
execFileSync("git", ["push", "-u", "origin", BRANCH], { cwd: worktree, stdio: "inherit" });

console.log(`[deploy] Publicado na branch ${BRANCH}.`);
console.log(
  "[deploy] Envie pelo File Manager da Hostinger os arquivos que ficam fora do Git " +
    "(videos/defesa/*.mp4, downloads/**/*.mp4 e arquivos > 95 MB).",
);
