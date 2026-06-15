"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";

const PET_WIDTH = 70;
const PET_HEIGHT = 88;
const REVEAL_SCROLL_Y = 520;
const CONTENT_MAX_WIDTH = 1680;

const lines = [
  "忍犬待命：先看错在哪里。",
  "别端着，继续往前拱。",
  "判断要能被验证。",
  "潜伏、观察、出手。",
  "继续搭建，别停。",
];

type Position = {
  x: number;
  y: number;
};

type DragState = {
  offsetX: number;
  offsetY: number;
  moved: boolean;
};

function clampPosition(position: Position): Position {
  const padding = 14;
  const measuredWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth || Number.POSITIVE_INFINITY,
    window.visualViewport?.width ?? window.innerWidth,
  );
  const measuredHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight || Number.POSITIVE_INFINITY,
    window.visualViewport?.height ?? window.innerHeight,
  );
  const viewportWidth = Math.max(measuredWidth, PET_WIDTH + padding * 2);
  const viewportHeight = Math.max(measuredHeight, PET_HEIGHT + padding * 2);

  return {
    x: Math.min(
      Math.max(position.x, padding),
      viewportWidth - PET_WIDTH - padding,
    ),
    y: Math.min(
      Math.max(position.y, padding),
      viewportHeight - PET_HEIGHT - padding,
    ),
  };
}

function getDefaultPetPosition(): Position {
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
  const mobileRightRail = Math.min(viewportWidth - PET_WIDTH - 18, 292);
  const sideMargin = Math.max(0, (viewportWidth - CONTENT_MAX_WIDTH) / 2);
  const desktopRightRail =
    sideMargin >= PET_WIDTH + 32
      ? viewportWidth - sideMargin + 20
      : viewportWidth - PET_WIDTH - 18;

  return clampPosition({
    x: viewportWidth >= 768 ? desktopRightRail : mobileRightRail,
    y: viewportHeight - PET_HEIGHT - 96,
  });
}

export function PortfolioCompanion() {
  const [position, setPosition] = useState<Position | null>(null);
  const [closed, setClosed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const movedDuringDragRef = useRef(false);
  const userPositionedRef = useRef(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPosition((current) => current ?? getDefaultPetPosition());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) =>
        current
          ? clampPosition(
              userPositionedRef.current ? current : getDefaultPetPosition(),
            )
          : current,
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    if (!dragState) return;

    const updatePosition = (clientX: number, clientY: number) => {
      const next = clampPosition({
        x: clientX - dragState.offsetX,
        y: clientY - dragState.offsetY,
      });

      movedDuringDragRef.current = true;
      userPositionedRef.current = true;
      setDragState((current) => (current ? { ...current, moved: true } : current));
      setPosition(next);
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

  if (closed || !visible) return null;

  const petStyle: CSSProperties = position
    ? {
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 9999,
        width: PET_WIDTH,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      }
    : {
        position: "fixed",
        right: 28,
        bottom: 108,
        zIndex: 9999,
        width: PET_WIDTH,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      };

  const startDrag = (
    clientX: number,
    clientY: number,
    rect: DOMRect,
  ) => {
    movedDuringDragRef.current = false;
    setDragState({
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
      moved: false,
    });
  };

  const handleMouseDown = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    const rect = event.currentTarget.getBoundingClientRect();

    event.preventDefault();
    startDrag(event.clientX, event.clientY, rect);
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    const touch = event.touches[0];
    if (!touch) return;
    const rect = event.currentTarget.getBoundingClientRect();

    startDrag(touch.clientX, touch.clientY, rect);
  };

  const handleClick = () => {
    if (movedDuringDragRef.current) {
      movedDuringDragRef.current = false;
      return;
    }

    setLineIndex((current) => (current + 1) % lines.length);
    setBubbleOpen(true);
  };

  return (
    <aside
      aria-label="作品集桌面伙伴"
      data-floating-pet
      className="portfolio-companion-pet hidden min-[1880px]:block"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      style={petStyle}
    >
      <div className="portfolio-companion-pet-shell relative">
        <div
          data-pet-bubble
          style={{
            position: "absolute",
            left: 0,
            bottom: 68,
            display: bubbleOpen ? undefined : "none",
            width: 160,
            border: "2px solid #14110e",
            background: "#fff2d8",
            padding: 7,
            color: "#14110e",
            boxShadow: "3px 3px 0 #14110e",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-[10px] font-semibold uppercase text-[#c92a20]">
              Portfolio Companion
            </p>
            <button
              type="button"
              aria-label="收起桌面伙伴台词"
              data-pet-bubble-close
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setBubbleOpen(false);
              }}
              className="grid size-5 shrink-0 place-items-center border border-[#8b3a28] text-xs text-[#8b3a28] transition hover:bg-[#c92a20] hover:text-[#fff2d8] focus:outline-none focus:ring-2 focus:ring-[#14110e]"
            >
              ×
            </button>
          </div>
          <p
            data-pet-line
            className="mt-1 text-xs font-semibold leading-5"
          >
            {lines[lineIndex]}
          </p>
        </div>

        <button
          type="button"
          aria-label="隐藏桌面伙伴"
          data-pet-close
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setClosed(true);
          }}
          className="absolute -right-1 -top-1 z-10 grid size-5 place-items-center border border-[#14110e] bg-[#fff2d8] text-xs text-[#8b3a28] shadow-[2px_2px_0_#14110e] transition hover:bg-[#c92a20] hover:text-[#fff2d8] focus:outline-none focus:ring-2 focus:ring-[#14110e]"
        >
          ×
        </button>

        <div
          className="portfolio-companion-pet-card"
          style={{
            marginInline: "auto",
            display: "grid",
            width: 62,
            height: 62,
            placeItems: "center",
            border: "2px solid #14110e",
            background: "#f4dfbd",
            boxShadow: "3px 3px 0 #14110e",
          }}
        >
          {/* Native img keeps this fixed desktop-pet sprite predictable. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/portfolio-companion.svg"
            alt="作品集桌面伙伴"
            width={56}
            height={56}
            className="portfolio-companion-pet-image"
            draggable={false}
            style={{
              display: "block",
              width: 56,
              height: 56,
              objectFit: "cover",
            }}
          />
          <span className="portfolio-companion-ninja-band" aria-hidden="true" />
          <span className="portfolio-companion-ninja-mark" aria-hidden="true">
            AI
          </span>
        </div>
        <span className="portfolio-companion-pet-shadow" aria-hidden="true" />
      </div>
    </aside>
  );
}
