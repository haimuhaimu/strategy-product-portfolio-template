import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { createNextInvocation } from "../scripts/next-with-wasm.mjs";

test("creates a shell-independent Next.js invocation with the WASM environment", () => {
  const projectRoot = path.join(process.cwd(), "portable-template-fixture");
  const invocation = createNextInvocation(["build", "--webpack"], {
    environment: {
      KEEP_ME: "yes",
      NEXT_TEST_WASM: "stale",
      NEXT_TEST_WASM_DIR: "stale",
    },
    execPath: "node-executable",
    projectRoot,
  });

  assert.equal(invocation.command, "node-executable");
  assert.deepEqual(invocation.args, [
    path.join(projectRoot, "node_modules", "next", "dist", "bin", "next"),
    "build",
    "--webpack",
  ]);
  assert.equal(invocation.options.cwd, projectRoot);
  assert.equal(invocation.options.stdio, "inherit");
  assert.deepEqual(invocation.options.env, {
    KEEP_ME: "yes",
    NEXT_TEST_WASM: "1",
    NEXT_TEST_WASM_DIR: path.join(
      projectRoot,
      "node_modules",
      "@next",
      "swc-wasm-nodejs",
    ),
  });
});

test("requires a Next.js subcommand", () => {
  assert.throws(
    () => createNextInvocation([]),
    /Expected a Next\.js subcommand/u,
  );
});
