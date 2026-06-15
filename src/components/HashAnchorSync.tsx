"use client";

import { useEffect } from "react";

export function HashAnchorSync() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;

      document.getElementById(id)?.scrollIntoView({ block: "start" });
    };

    const scheduleScroll = () => {
      window.requestAnimationFrame(() => {
        scrollToHash();
        window.setTimeout(scrollToHash, 250);
      });
    };

    scheduleScroll();
    window.addEventListener("hashchange", scheduleScroll);

    return () => window.removeEventListener("hashchange", scheduleScroll);
  }, []);

  return null;
}
