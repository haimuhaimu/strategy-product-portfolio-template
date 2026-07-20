import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createStaticExportServer,
  parseServerOptions,
} from "../scripts/serve-static-export.mjs";

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  assert.ok(address && typeof address === "object");
  return `http://127.0.0.1:${address.port}`;
}

test("parses portable host and port arguments", () => {
  assert.deepEqual(
    parseServerOptions(["--host", "0.0.0.0", "--port", "4173"]),
    { host: "0.0.0.0", port: 4173 },
  );

  assert.throws(
    () => parseServerOptions(["--port", "70000"]),
    /port must be an integer between 1 and 65535/u,
  );
});

test("serves a Next.js static export with safe routing semantics", async (t) => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "portfolio-export-"));
  await mkdir(path.join(outDir, "profile"), { recursive: true });
  await writeFile(path.join(outDir, "index.html"), "home", "utf8");
  await writeFile(path.join(outDir, "profile", "index.html"), "profile", "utf8");
  await writeFile(path.join(outDir, "404.html"), "not found", "utf8");

  const server = createStaticExportServer({ outDir });
  const origin = await listen(server);

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(outDir, { force: true, recursive: true });
  });

  const home = await fetch(`${origin}/`);
  assert.equal(home.status, 200);
  assert.equal(home.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(await home.text(), "home");

  const profile = await fetch(`${origin}/profile/`);
  assert.equal(profile.status, 200);
  assert.equal(await profile.text(), "profile");

  const head = await fetch(`${origin}/profile/`, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");

  const missing = await fetch(`${origin}/missing/`);
  assert.equal(missing.status, 404);
  assert.equal(await missing.text(), "not found");

  const traversal = await fetch(`${origin}/%2e%2e%2fpackage.json`);
  assert.equal(traversal.status, 404);
  assert.equal(await traversal.text(), "not found");

  const unsupported = await fetch(`${origin}/`, { method: "POST" });
  assert.equal(unsupported.status, 405);
  assert.equal(unsupported.headers.get("allow"), "GET, HEAD");
});
