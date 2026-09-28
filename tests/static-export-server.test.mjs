import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createStaticExportServer,
  parseServerOptions,
  resolveStaticFile,
  startStaticExportServer,
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
  assert.deepEqual(parseServerOptions([], {}), { host: "127.0.0.1", port: 3000 });
  assert.deepEqual(parseServerOptions([], { HOST: "localhost", PORT: "4174" }), {
    host: "localhost", port: 4174,
  });
  assert.deepEqual(
    parseServerOptions(["--host", "0.0.0.0", "--port", "4173"], { PORT: "4174" }),
    { host: "0.0.0.0", port: 4173 },
  );

  assert.throws(
    () => parseServerOptions(["--port", "70000"]),
    /port must be an integer between 1 and 65535/u,
  );
});

test("does not follow a directory link outside the export root", async (t) => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "portfolio-link-"));
  t.after(() => rm(fixture, { force: true, recursive: true }));
  const outDir = path.join(fixture, "out");
  const outside = path.join(fixture, "outside");
  await mkdir(outDir);
  await mkdir(outside);
  await writeFile(path.join(outside, "fixture.txt"), "outside fixture");
  await symlink(outside, path.join(outDir, "linked"), process.platform === "win32" ? "junction" : "dir");

  assert.equal(await resolveStaticFile("/linked/fixture.txt", outDir), null);
});

test("reports a missing build before opening a server", async (t) => {
  const outDir = await mkdtemp(path.join(os.tmpdir(), "portfolio-empty-"));
  t.after(() => rm(outDir, { force: true, recursive: true }));
  await assert.rejects(
    startStaticExportServer({ outDir, host: "127.0.0.1", port: 0 }),
    /Run "npm run build" first/u,
  );
});

test("rejects an external custom 404 link", async (t) => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "portfolio-not-found-"));
  const outDir = path.join(fixture, "out");
  await mkdir(outDir);
  await writeFile(path.join(fixture, "outside.html"), "outside fixture");
  t.after(() => rm(fixture, { force: true, recursive: true }));
  try {
    await symlink(path.join(fixture, "outside.html"), path.join(outDir, "404.html"), "file");
  } catch (error) {
    if (process.platform === "win32" && error.code === "EPERM") {
      t.skip("Windows file symlink requires developer mode or administrator privileges");
      return;
    }
    throw error;
  }
  const server = createStaticExportServer({ outDir });
  const origin = await listen(server);
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const response = await fetch(`${origin}/missing/`);
  assert.equal(response.status, 404);
  assert.equal(await response.text(), "Not found");
});

test("serves a Next.js static export with safe routing semantics", async (t) => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "portfolio-export-"));
  const outDir = path.join(fixture, "out");
  await mkdir(path.join(outDir, "profile"), { recursive: true });
  await writeFile(path.join(fixture, "fixture.txt"), "outside fixture", "utf8");
  await writeFile(path.join(outDir, "index.html"), "home", "utf8");
  await writeFile(path.join(outDir, "profile", "index.html"), "profile", "utf8");
  await writeFile(path.join(outDir, "404.html"), "not found", "utf8");
  await writeFile(path.join(outDir, "style.css"), "body { color: red; }", "utf8");

  const server = createStaticExportServer({ outDir });
  const origin = await listen(server);

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(fixture, { force: true, recursive: true });
  });

  const home = await fetch(`${origin}/`);
  assert.equal(home.status, 200);
  assert.equal(home.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(await home.text(), "home");

  const profile = await fetch(`${origin}/profile/`);
  assert.equal(profile.status, 200);
  assert.equal(await profile.text(), "profile");

  const withoutSlash = await fetch(`${origin}/profile?source=preview`);
  assert.equal(withoutSlash.status, 200);
  assert.equal(await withoutSlash.text(), "profile");

  const style = await fetch(`${origin}/style.css?v=1`);
  assert.equal(style.status, 200);
  assert.equal(style.headers.get("content-type"), "text/css; charset=utf-8");
  assert.equal(await style.text(), "body { color: red; }");

  const head = await fetch(`${origin}/profile/`, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");

  const missing = await fetch(`${origin}/missing/`);
  assert.equal(missing.status, 404);
  assert.equal(await missing.text(), "not found");

  const traversal = await fetch(`${origin}/%2e%2e%2ffixture.txt`);
  assert.equal(traversal.status, 404);
  assert.equal(await traversal.text(), "not found");

  const malformed = await fetch(`${origin}/%E0%A4%A`);
  assert.equal(malformed.status, 404);
  assert.equal(await malformed.text(), "not found");

  const unsupported = await fetch(`${origin}/`, { method: "POST" });
  assert.equal(unsupported.status, 405);
  assert.equal(unsupported.headers.get("allow"), "GET, HEAD");
});
