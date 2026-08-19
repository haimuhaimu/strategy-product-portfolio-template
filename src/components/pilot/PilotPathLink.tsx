"use client";

import type { ComponentProps } from "react";
import { StaticPageLink } from "@/components/StaticPageLink";
import { recordPmfPilotEvent } from "@/lib/pmf-pilot.mjs";

type PilotPath = "skill_first" | "launchpad" | "example_config";

type PilotPathLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  path: PilotPath;
  external?: boolean;
};

export function PilotPathLink({ href, path, external = false, onClick, ...props }: PilotPathLinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    recordPmfPilotEvent("path_selected", { value: path });
    onClick?.(event);
  }

  if (external) {
    return <a href={href} target="_blank" rel="noreferrer" onClick={handleClick} {...props} />;
  }

  return <StaticPageLink href={href} onClick={handleClick} {...props} />;
}
