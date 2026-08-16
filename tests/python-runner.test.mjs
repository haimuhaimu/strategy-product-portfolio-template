import assert from "node:assert/strict";
import test from "node:test";

import { createPythonInvocation } from "../scripts/run-python.mjs";

const scriptArguments = [
  "skills/portfolio-story-builder/scripts/audit_portfolio.py",
  "skills/portfolio-story-builder/assets/portfolio-v2-minimal.json",
];

test("uses python3 for the Skill audit on POSIX systems", () => {
  const invocation = createPythonInvocation(scriptArguments, {
    environment: { KEEP_ME: "yes" },
    platform: "darwin",
  });

  assert.equal(invocation.command, "python3");
  assert.deepEqual(invocation.args, scriptArguments);
  assert.deepEqual(invocation.options, {
    env: { KEEP_ME: "yes" },
    stdio: "inherit",
  });
});

test("uses the standard python launcher on Windows", () => {
  const invocation = createPythonInvocation(scriptArguments, {
    environment: {},
    platform: "win32",
  });

  assert.equal(invocation.command, "python");
});

test("honors an explicit PYTHON interpreter override", () => {
  const invocation = createPythonInvocation(scriptArguments, {
    environment: { PYTHON: "/opt/custom/python" },
    platform: "linux",
  });

  assert.equal(invocation.command, "/opt/custom/python");
});

test("requires a Python script path", () => {
  assert.throws(
    () => createPythonInvocation([]),
    /Expected a Python script path/u,
  );
});
