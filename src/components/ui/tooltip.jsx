import React, { createContext, useContext } from "react";

/**
 * Tooltip component using TailwindCSS for styling.
 * Usage:
 * <Tooltip content="Tooltip text"><button>Hover me</button></Tooltip>
 */
const TooltipContext = createContext();
export function TooltipProvider({ children }) {
  return <TooltipContext.Provider value={{}}>{children}</TooltipContext.Provider>;
}

export function TooltipTrigger({ asChild = false, children, ...props }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      'data-tooltip-trigger': true,
    });
  }
  return (
    <span {...props} data-tooltip-trigger>
      {children}
    </span>
  );
}

export function TooltipContent({ children, className = "", ...props }) {
  return (
    <div
      className={`pointer-events-none absolute z-50 left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded bg-slate-800 text-white text-xs whitespace-pre-line opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 shadow-lg border border-slate-800 ${className}`}
      role="tooltip"
      {...props}
    >
      {children}
    </div>
  );
}

export function Tooltip({ children, ...props }) {
  // If children is an array, expect [trigger, content]
  if (Array.isArray(children) && children.length === 2) {
    return (
      <div className="relative group inline-block" {...props}>
        {children[0]}
        {children[1]}
      </div>
    );
  }
  // Fallback: just wrap children
  return (
    <div className="relative group inline-block" {...props}>
      {children}
    </div>
  );
}
