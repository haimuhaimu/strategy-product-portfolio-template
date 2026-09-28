import type { ComponentProps } from "react";
import { staticPageHref } from "@/lib/paths";

type StaticPageLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

/**
 * Uses the exported index.html file explicitly so navigation also works on
 * static hosts that do not resolve a directory URL to its index document.
 */
export function StaticPageLink({ href, ...props }: StaticPageLinkProps) {
  return <a href={staticPageHref(href)} {...props} />;
}
