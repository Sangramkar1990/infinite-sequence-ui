import * as React from "react";
// import { cn } from "@/lib/utils";
import { cn } from "../../lib/utils";// Optional utility for classNames

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse rounded-md bg-slate-200 dark:bg-slate-700",
        className
      )}
      {...props}
    />
  )
);

Skeleton.displayName = "Skeleton";
