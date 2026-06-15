"use client";

import {
  useEffect,
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";

const TOTAL_SECONDS = 8 * 60;
const WIDGET_WIDTH = 112;
const WIDGET_HEIGHT = 52;
const REVEAL_SCROLL_Y = 520;
const STORAGE_SECONDS = "cq-understanding-seconds-v2";
const STORAGE_CLOSED = "cq-understanding-closed-v8";
const STORAGE_POSITION = "cq-understanding-position-v8";

type Position = {
  x: number;
  y: number;
};

type DragState = {
  offsetX: number;
  offsetY: number;
};

function clampPosition(position: Position): Position {
  const padding = 12;
  const viewportWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth || window.innerWidth,
    window.visualViewport?.width ?? window.innerWidth,
  );
  const viewportHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight || window.innerHeight,
    window.visualViewport?.height ?? window.innerHeight,
  );

  return {
    x: Math.min(
      Math.max(position.x, padding),
      viewportWidth - WIDGET_WIDTH - padding,
    ),
    y: Math.min(
      Math.max(position.y, padding),
      viewportHeight - WIDGET_HEIGHT - padding,
    ),
  };
}

function getDefaultPosition(): Position {
  if (typeof window !== "undefined") {
    const viewportHeight = Math.min(
      window.innerHeight,
      document.documentElement.clientHeight || window.innerHeight,
      window.visualViewport?.height ?? window.innerHeight,
    );

    return {
      x: 18,
      y: viewportHeight - WIDGET_HEIGHT - 96,
    };
  }

  return {
    x: 18,
    y: 90,
  };
}

export function UnderstandingProgressWidget() {
  const [seconds, setSeconds] = useState(0);
  const [closed, setClosed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 18, y: 90 });
  const [dragState, setDragState] = useState<DragState | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const savedClosed = sessionStorage.getItem(STORAGE_CLOSED) === "true";
      const savedSeconds = Number(sessionStorage.getItem(STORAGE_SECONDS) ?? "0");
      const savedPosition = sessionStorage.getItem(STORAGE_POSITION);

      setClosed(savedClosed);
      setSeconds(Number.isFinite(savedSeconds) ? savedSeconds : 0);

      if (savedPosition) {
        try {
          setPosition(clampPosition(JSON.parse(savedPosition) as Position));
          return;
        } catch {
          setPosition(clampPosition(getDefaultPosition()));
          return;
        }
      }

      setPosition(clampPosition(getDefaultPosition()));
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setVisible(window.scrollY > REVEAL_SCROLL_Y);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  useEffect(() => {
    if (closed) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      setSeconds((current) => {
        const next = Math.min(current + 1, TOTAL_SECONDS);
        sessionStorage.setItem(STORAGE_SECONDS, String(next));
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [closed]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => (current ? clampPosition(current) : current));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!dragState) return;

    const updatePosition = (clientX: number, clientY: number) => {
      const next = clampPosition({
        x: clientX - dragState.offsetX,
        y: clientY - dragState.offsetY,
      });

      setPosition(next);
      sessionStorage.setItem(STORAGE_POSITION, JSON.stringify(next));
    };

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: globalThis.TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      event.preventDefault();
      updatePosition(touch.clientX, touch.clientY);
    };

    const handleDragEnd = () => setDragState(null);
    const touchOptions = { passive: false };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleTouchMove, touchOptions);
    window.addEventListener("touchend", handleDragEnd);
    window.addEventListener("touchcancel", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
      window.removeEventListener("touchcancel", handleDragEnd);
    };
  }, [dragState]);

  const progress = Math.min(100, Math.round((seconds / TOTAL_SECONDS) * 100));
  const remainingMinutes = Math.max(0, Math.ceil((TOTAL_SECONDS - seconds) / 60));

  if (closed || !visible) return null;

  const startDrag = (clientX: number, clientY: number) => {
    setDragState({
      offsetX: clientX - position.x,
      offsetY: clientY - position.y,
    });
  };

  const handleMouseDown = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;

    event.preventDefault();
    startDrag(event.clientX, event.clientY);
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    const touch = event.touches[0];
    if (!touch) return;

    startDrag(touch.clientX, touch.clientY);
  };

  return (
    <aside
      aria-label="了解作品集进度"
      data-floating-progress
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="fixed z-40 hidden w-[112px] cursor-grab select-none border-2 border-[#14110e] bg-[#fff2d8]/95 p-1.5 text-[#14110e] shadow-[3px_3px_0_#14110e] backdrop-blur active:cursor-grabbing min-[1880px]:block"
      style={{ left: position.x, top: position.y, zIndex: 9000 }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] font-semibold uppercase text-[#c92a20]">
          了解作品集
        </p>
        <button
          type="button"
          aria-label="关闭了解进度"
          data-progress-close
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
          onClick={() => {
            setClosed(true);
            sessionStorage.setItem(STORAGE_CLOSED, "true");
          }}
          className="grid size-5 shrink-0 place-items-center border border-[#8b3a28] text-xs text-[#8b3a28] transition hover:bg-[#c92a20] hover:text-[#fff2d8] focus:outline-none focus:ring-2 focus:ring-[#14110e]"
        >
          ×
        </button>
      </div>

      <div className="mt-1.5 h-2 border border-[#14110e] bg-[#f4dfbd]">
        <div
          data-progress-bar
          className="h-full bg-[#c92a20]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p
        data-progress-copy
        className="mt-1 font-mono text-[10px] font-semibold text-[#5b4635]"
      >
        {progress >= 100 ? "100% / 已读完" : `${progress}% / 还差 ${remainingMinutes} 分`}
      </p>
    </aside>
  );
}
