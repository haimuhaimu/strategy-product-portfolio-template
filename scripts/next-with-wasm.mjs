import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const defaultProjectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export function createNextInvocation(
  nextArguments,
  {
    environment = process.env,
    execPath = process.execPath,
    projectRoot = defaultProjectRoot,
  } = {},
) {
  if (!Array.isArray(nextArguments) || nextArguments.length === 0) {
    throw new TypeError("Expected a Next.js subcommand and optional arguments.");
  }

  return {
    command: execPath,
    args: [
      path.join(projectRoot, "node_modules", "next", "dist", "bin", "next"),
      ...nextArguments,
    ],
    options: {
      cwd: projectRoot,
      env: {
        ...environment,
        NEXT_TEST_WASM: "1",
        NEXT_TEST_WASM_DIR: path.join(
          projectRoot,
          "node_modules",
          "@next",
          "swc-wasm-nodejs",
        ),
      },
      stdio: "inherit",
    },
  };
}

export function runNext(nextArguments) {
  const { command, args, options } = createNextInvocation(nextArguments);
  const child = spawn(command, args, options);

  child.once("error", (error) => {
    console.error(`Unable to start Next.js: ${error.message}`);
    process.exitCode = 1;
  });

  child.once("exit", (code, signal) => {
    if (signal) {
      console.error(`Next.js exited after receiving ${signal}.`);
      process.exitCode = 1;
      return;
    }
    process.exitCode = code ?? 1;
  });

  return child;
}

const isDirectExecution =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectExecution) {
  try {
    runNext(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
