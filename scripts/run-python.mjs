import { spawn } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function createPythonInvocation(
  pythonArguments,
  {
    environment = process.env,
    platform = process.platform,
  } = {},
) {
  if (!Array.isArray(pythonArguments) || pythonArguments.length === 0) {
    throw new TypeError("Expected a Python script path and optional arguments.");
  }

  const configuredInterpreter = environment.PYTHON?.trim();

  return {
    command:
      configuredInterpreter || (platform === "win32" ? "python" : "python3"),
    args: pythonArguments,
    options: {
      env: environment,
      stdio: "inherit",
    },
  };
}

export function runPython(pythonArguments) {
  const { command, args, options } = createPythonInvocation(pythonArguments);
  const child = spawn(command, args, options);

  child.once("error", (error) => {
    console.error(`Unable to start Python 3: ${error.message}`);
    process.exitCode = 1;
  });

  child.once("exit", (code, signal) => {
    if (signal) {
      console.error(`Python 3 exited after receiving ${signal}.`);
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
    runPython(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
