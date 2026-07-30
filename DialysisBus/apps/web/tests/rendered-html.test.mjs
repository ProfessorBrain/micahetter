import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the dialysis and transit explorer shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Dialysis &amp; Transit Explorer<\/title>/i);
  assert.match(html, /Explore the space between care and transit\./);
  assert.match(html, /Straight-line distance is context/);
  assert.match(html, /Dialysis facilities/);
  assert.match(html, /Public transit stops/);
  assert.match(html, /400/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
