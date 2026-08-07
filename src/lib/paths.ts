import { withBasePath as prefixBasePath } from "./github-pages.mjs";

export function withBasePath(pathname: string) {
  return prefixBasePath(pathname, process.env.NEXT_PUBLIC_BASE_PATH);
}
