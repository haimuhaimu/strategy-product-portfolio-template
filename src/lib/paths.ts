import {
  getStaticPageHref,
  withBasePath as prefixBasePath,
} from "./github-pages.mjs";

export function withBasePath(pathname: string) {
  return prefixBasePath(pathname, process.env.NEXT_PUBLIC_BASE_PATH);
}

export function staticPageHref(pathname: string) {
  return getStaticPageHref(pathname, process.env.NEXT_PUBLIC_BASE_PATH);
}
