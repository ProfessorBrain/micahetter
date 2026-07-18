import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build as viteBuild } from "vite";

const projectRoot = new URL("../", import.meta.url);
const outputUrl = new URL("Critical-Structures.html", projectRoot);

async function renderAppShell() {
  const workerUrl = new URL("dist/server/index.js", projectRoot);
  workerUrl.searchParams.set("standalone", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://critical-structures.local/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  if (!response.ok) throw new Error(`Unable to render app shell (${response.status})`);
  const html = await response.text();
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  if (!body) throw new Error("Rendered app shell did not contain a body.");
  return body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").trim();
}

async function bundleBrowserCode() {
  const result = await viteBuild({
    configFile: false,
    logLevel: "silent",
    build: {
      write: false,
      minify: "esbuild",
      target: "es2022",
      rollupOptions: {
        input: fileURLToPath(new URL("public/js/app.js", projectRoot)),
        output: { format: "iife", name: "CriticalStructures", inlineDynamicImports: true },
      },
    },
  });
  const output = Array.isArray(result) ? result.flatMap((entry) => entry.output) : result.output;
  const chunk = output.find((entry) => entry.type === "chunk" && entry.isEntry);
  if (!chunk) throw new Error("Browser bundle did not contain an entry chunk.");
  return chunk.code;
}

const [body, stylesheet, script, structures, boards, favicon] = await Promise.all([
  renderAppShell(),
  readFile(new URL("app/globals.css", projectRoot), "utf8"),
  bundleBrowserCode(),
  readFile(new URL("public/data/structures.json", projectRoot), "utf8").then(JSON.parse),
  readFile(new URL("public/data/boards.json", projectRoot), "utf8").then(JSON.parse),
  readFile(new URL("public/favicon.svg", projectRoot), "utf8"),
]);

const css = stylesheet.replace(/^@import\s+["']tailwindcss["'];?\s*/m, "");
const content = JSON.stringify({ structures: structures.structures, contentMeta: structures, boards: boards.boards })
  .replaceAll("<", "\\u003c")
  .replaceAll(" ", "\\u2028")
  .replaceAll(" ", "\\u2029");
const faviconData = `data:image/svg+xml;base64,${Buffer.from(favicon).toString("base64")}`;

const standalone = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#102a2a">
  <meta name="description" content="Identify, navigate, and place anatomical structures in a polished data-driven learning game.">
  <title>Critical Structures — Anatomy Placement Game</title>
  <link rel="icon" href="${faviconData}">
  <style>${css}</style>
</head>
<body>
${body}
<script>globalThis.__CRITICAL_STRUCTURES_CONTENT__=${content};</script>
<script>${script}</script>
</body>
</html>
`;

await writeFile(outputUrl, standalone, "utf8");
console.log(fileURLToPath(outputUrl));
