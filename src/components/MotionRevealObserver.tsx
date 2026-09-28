"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const MOTION_TARGETS = [
  "[data-motion-section]",
  "main > section:not(:first-child)",
  ".motion-card",
  ".template-panel",
  ".template-detail-section li",
].join(", ");

const MOTION_STATE_SELECTOR = "[data-motion-state]";

function clearMotionStates() {
  document.querySelectorAll<HTMLElement>(MOTION_STATE_SELECTOR).forEach((target) => {
    delete target.dataset.motionState;
  });
}

function isInViewport(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

export function MotionRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsViewTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: view()") &&
      CSS.supports("animation-range: entry 0% exit 100%");

    root.classList.remove("motion-fallback-ready");
    clearMotionStates();

    if (reduceMotion || supportsViewTimeline || !("IntersectionObserver" in window)) {
      return;
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>(MOTION_TARGETS));

    targets.forEach((target) => {
      target.dataset.motionState = isInViewport(target) ? "in" : "out";
    });
    root.classList.add("motion-fallback-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (entry.target as HTMLElement).dataset.motionState = entry.isIntersecting ? "in" : "out";
        });
      },
      {
        rootMargin: "-7% 0px -11% 0px",
        threshold: 0.08,
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      root.classList.remove("motion-fallback-ready");
      clearMotionStates();
    };
  }, [pathname]);

  return null;
}
