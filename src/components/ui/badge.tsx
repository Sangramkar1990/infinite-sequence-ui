import {cn } from "../../lib/utils"; // Optional utility for classNames
import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "default" && "bg-slate-900 text-white",
        variant === "secondary" && "bg-slate-100 text-slate-800",
        variant === "beginner" && "bg-green-100 text-green-700",
        variant === "intermediate" && "bg-amber-100 text-amber-700",
        variant === "advanced" && "bg-red-100 text-red-700",
        variant === "outline" &&
          "border border-slate-200 text-slate-700 bg-transparent",
        className
      )}
      {...props}
    />
  );
}
