"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PointerEvent, ReactNode } from "react";

import type { TooltipContent } from "@/types/charts";

interface TooltipApi {
  show: (content: TooltipContent, x: number, y: number) => void;
  hide: () => void;
}

const TooltipContext = createContext<TooltipApi>({ show: () => undefined, hide: () => undefined });

/**
 * One shared tooltip for every chart on the page. Charts describe what to show; the provider owns
 * positioning (flipping at the viewport edges) and hides on scroll.
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ content: TooltipContent; x: number; y: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !state) return;
    const { offsetWidth: w, offsetHeight: h } = el;
    let left = state.x + 16;
    let top = state.y - h - 14;
    if (left + w > window.innerWidth - 8) left = state.x - w - 16;
    if (left < 8) left = 8;
    if (top < 8) top = state.y + 18;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }, [state]);

  useEffect(() => {
    const onScroll = () => setVisible(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const api = useMemo<TooltipApi>(
    () => ({
      show: (content, x, y) => {
        setState({ content, x, y });
        setVisible(true);
      },
      hide: () => setVisible(false),
    }),
    [],
  );

  return (
    <TooltipContext.Provider value={api}>
      {children}
      <div id="tt" ref={ref} className={visible ? "on" : undefined} aria-hidden="true">
        {state ? (
          <>
            <b>{state.content.title}</b>
            {state.content.rows.map((row) => (
              <div key={row.label}>
                <i style={{ background: row.color }} />
                {row.label}
                <span>{row.value}</span>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </TooltipContext.Provider>
  );
}

export function useTooltip(): TooltipApi {
  return useContext(TooltipContext);
}

/** Pointer handlers that show `content` at the cursor. */
export function useTooltipTarget() {
  const { show, hide } = useTooltip();
  const bind = useCallback(
    (content: TooltipContent) => ({
      onPointerMove: (e: PointerEvent) => show(content, e.clientX, e.clientY),
      onPointerLeave: hide,
    }),
    [show, hide],
  );
  return bind;
}
