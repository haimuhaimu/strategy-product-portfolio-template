import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { parseArgs } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const defaultOutDir = path.join(projectRoot, "out");

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
]);

export function parseServerOptions(args, environment = process.env) {
  const { values } = parseArgs({
    args,
    options: {
      host: {
        default: environment.HOST || "127.0.0.1",
        type: "string",
      },
      port: {
        default: environment.PORT || "3000",
        type: "string",
      },
    },
    strict: true,
  });
  const port = Number(values.port);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new RangeError("port must be an integer between 1 and 65535");
  }

  return { host: values.host, port };
}

function isInsideRoot(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

export async function resolveStaticFile(requestUrl, outDir = defaultOutDir) {
  const root = path.resolve(outDir);
  let pathname;

  try {
    pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  } catch {
    return null;
  }

  const relativePath = pathname.replace(/^\/+/, "");
  const directPath = path.resolve(root, relativePath);
  const candidates = pathname.endsWith("/")
    ? [path.join(directPath, "index.html")]
    : [directPath, path.join(directPath, "index.html")];

  for (const candidate of candidates) {
    if (isInsideRoot(root, candidate) && (await isFile(candidate))) {
      return candidate;
    }
  }

  return null;
}

export function createStaticExportServer({ outDir = defaultOutDir } = {}) {
  const root = path.resolve(outDir);

  return createServer(async (request, response) => {
    try {
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, {
          Allow: "GET, HEAD",
          "Content-Type": "text/plain; charset=utf-8",
        });
        response.end("Method not allowed");
        return;
      }

      const requestedFile = await resolveStaticFile(request.url || "/", root);
      const filePath = requestedFile || path.join(root, "404.html");
      const hasCustomNotFound = !requestedFile && (await isFile(filePath));

      if (!requestedFile && !hasCustomNotFound) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }

      const fileStats = await stat(filePath);
      response.writeHead(requestedFile ? 200 : 404, {
        "Cache-Control": "no-store",
        "Content-Length": fileStats.size,
        "Content-Type":
          contentTypes.get(path.extname(filePath).toLowerCase()) ||
          "application/octet-stream",
      });

      if (request.method === "HEAD") {
        response.end();
        return;
      }

      await pipeline(createReadStream(filePath), response);
    } catch (error) {
      if (!response.headersSent) {
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Internal server error");
      } else {
        response.destroy(error instanceof Error ? error : undefined);
      }
    }
  });
}

export async function startStaticExportServer({
  host,
  outDir = defaultOutDir,
  port,
}) {
  if (!(await isFile(path.join(outDir, "index.html")))) {
    throw new Error('Static export not found. Run "npm run build" first.');
  }

  const server = createStaticExportServer({ outDir });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, resolve);
  });

  console.log(`Static export ready at http://${host}:${port}`);
  return server;
}

const isDirectExecution =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectExecution) {
  try {
    const options = parseServerOptions(process.argv.slice(2));
    await startStaticExportServer(options);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
