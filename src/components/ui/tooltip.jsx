// components/ui/tooltip.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const TooltipCtx = createContext({
  delayDuration: 300,
  skipDelayDuration: 200,
});

export function TooltipProvider({
  children,
  delayDuration = 300,
  skipDelayDuration = 200,
}) {
  const value = useMemo(
    () => ({ delayDuration, skipDelayDuration }),
    [delayDuration, skipDelayDuration]
  );
  return <TooltipCtx.Provider value={value}>{children}</TooltipCtx.Provider>;
}

const TooltipStateCtx = createContext(null);

export function Tooltip({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disableDelay = false,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (v) => {
      if (!isControlled) setUncontrolledOpen(v);
      if (onOpenChange) onOpenChange(v);
    },
    [isControlled, onOpenChange]
  );

  const triggerRef = useRef(null);
  const describedById = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const value = useMemo(
    () => ({ open, setOpen, triggerRef, describedById }),
    [open, setOpen, describedById]
  );

  return (
    <TooltipStateCtx.Provider value={value}>
      <span
        hidden
        aria-hidden="true"
        data-tooltip-disable-delay={disableDelay ? "true" : "false"}
      />
      {children}
    </TooltipStateCtx.Provider>
  );
}

export function TooltipTrigger({
  asChild,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onTouchStart,
  onClick,
  ...props
}) {
  const state = useRequiredTooltipState("TooltipTrigger");
  const provider = useContext(TooltipCtx);
  const [ignoreDelay, setIgnoreDelay] = useState(false);
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);
  const lastLeaveTime = useRef(0);

  useEffect(() => {
    const node = document.querySelector(
      "[data-tooltip-disable-delay='true']"
    );
    setIgnoreDelay(Boolean(node));
  }, []);

  const openWithDelay = useCallback(() => {
    const now = Date.now();
    const withinSkip = now - lastLeaveTime.current < provider.skipDelayDuration;
    const shouldDelay = !(ignoreDelay || withinSkip);

    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(
      () => state.setOpen(true),
      shouldDelay ? provider.delayDuration : 0
    );
  }, [provider, state, ignoreDelay]);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const handleMouseEnter = (e) => {
    openWithDelay();
    if (onMouseEnter) onMouseEnter(e);
  };
  const handleMouseLeave = (e) => {
    clearHoverTimer();
    state.setOpen(false);
    lastLeaveTime.current = Date.now();
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => {}, provider.skipDelayDuration);
    if (onMouseLeave) onMouseLeave(e);
  };
  const handleFocus = (e) => {
    state.setOpen(true);
    if (onFocus) onFocus(e);
  };
  const handleBlur = (e) => {
    state.setOpen(false);
    if (onBlur) onBlur(e);
  };
  const handleTouchStart = (e) => {
    state.setOpen((prev) => !prev);
    if (onTouchStart) onTouchStart(e);
  };
  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

  const sharedProps = {
    ref: state.triggerRef,
    "aria-describedby": state.open ? state.describedById : undefined,
    "aria-expanded": state.open || undefined,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onTouchStart: handleTouchStart,
    onClick: handleClick,
  };

  if (asChild && React.isValidElement(props.children)) {
    return React.cloneElement(props.children, sharedProps);
  }

  return (
    <button
      type="button"
      {...props}
      {...sharedProps}
      className={["outline-none", props.className].filter(Boolean).join(" ")}
    />
  );
}

export function TooltipContent({
  children,
  side = "top",
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
  className,
  container,
}) {
  const state = useRequiredTooltipState("TooltipContent");
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = state.triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = 0;
    let left = 0;

    const cross = (align) => {
      if (align === "start") return 0;
      if (align === "end") return 1;
      return 0.5;
    };
    const alignFactor = cross(align);

    const triggerCenterX = rect.left + rect.width * alignFactor;
    const triggerCenterY = rect.top + rect.height * alignFactor;

    switch (side) {
      case "top":
        top = rect.top + scrollY - sideOffset;
        left = triggerCenterX + scrollX;
        break;
      case "bottom":
        top = rect.bottom + scrollY + sideOffset;
        left = triggerCenterX + scrollX;
        break;
      case "left":
        top = triggerCenterY + scrollY;
        left = rect.left + scrollX - sideOffset;
        break;
      case "right":
        top = triggerCenterY + scrollY;
        left = rect.right + scrollX + sideOffset;
        break;
    }

    if (side === "top" || side === "bottom") {
      left +=
        alignOffset +
        (align === "start"
          ? -rect.width / 2
          : align === "end"
          ? rect.width / 2
          : 0);
    } else {
      top +=
        alignOffset +
        (align === "start"
          ? -rect.height / 2
          : align === "end"
          ? rect.height / 2
          : 0);
    }

    setPos({ top, left });
  }, [align, alignOffset, side, sideOffset, state.triggerRef]);

  useEffect(() => {
    if (!state.open) return;
    updatePosition();
    const ro = new ResizeObserver(updatePosition);
    if (state.triggerRef.current) ro.observe(state.triggerRef.current);
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    const id = window.setInterval(updatePosition, 100);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearInterval(id);
    };
  }, [state.open, updatePosition, state.triggerRef]);

  if (!mounted) return null;
  if (!state.open) return null;

  const portalTarget = container ?? document.body;

  const base =
    "pointer-events-none absolute z-50 will-change-transform max-w-xs rounded-lg border bg-gray-900 text-white text-sm px-3 py-2 shadow-lg";
  const arrowStyles =
    "after:content-[''] after:absolute after:w-2.5 after:h-2.5 after:bg-gray-900 after:rotate-45 after:border after:border-gray-800";
  const arrowPos =
    side === "top"
      ? "after:-bottom-1 after:left-1/2 after:-translate-x-1/2"
      : side === "bottom"
      ? "after:-top-1 after:left-1/2 after:-translate-x-1/2"
      : side === "left"
      ? "after:-right-1 after:top-1/2 after:-translate-y-1/2"
      : "after:-left-1 after:top-1/2 after:-translate-y-1/2";

  return createPortal(
    <div
      role="tooltip"
      id={state.describedById}
      ref={contentRef}
      data-side={side}
      className={[base, arrowStyles, arrowPos, className]
        .filter(Boolean)
        .join(" ")}
      style={{
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        transform:
          side === "top"
            ? "translate(-50%, -100%)"
            : side === "bottom"
            ? "translate(-50%, 0)"
            : side === "left"
            ? "translate(-100%, -50%)"
            : "translate(0, -50%)",
      }}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>,
    portalTarget
  );
}

/* ------------ helpers ------------ */
function useRequiredTooltipState(caller) {
  const state = useContext(TooltipStateCtx);
  if (!state) {
    throw new Error(`${caller} must be used inside <Tooltip>`);
  }
  return state;
}
