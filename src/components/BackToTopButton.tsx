"use client";

import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > window.innerHeight * 0.75);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="返回首屏"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
        "fixed bottom-4 right-4 z-30 grid size-10 place-items-center border-2 border-[#14110e] bg-[#f4dfbd]/95 font-mono text-lg font-semibold text-[#c92a20] shadow-[3px_3px_0_#14110e] backdrop-blur transition duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#c92a20] hover:text-[#fff2d8] hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#14110e] focus:ring-offset-2 sm:bottom-6 sm:right-6",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      ].join(" ")}
    >
      ↑
    </button>
  );
}
