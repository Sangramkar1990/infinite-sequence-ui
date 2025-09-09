import * as React from "react";
import { cn } from "../../lib/utils";

const TooltipContext = React.createContext(null);

export function TooltipProvider({ children, delayDuration = 300 }) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [content, setContent] = React.useState(null);
  const [side, setSide] = React.useState("bottom");
  const [align, setAlign] = React.useState("center");
  
  const value = React.useMemo(() => ({
    open,
    setOpen,
    position,
    setPosition,
    content,
    setContent,
    delayDuration,
    side,
    setSide,
    align,
    setAlign
  }), [open, position, content, delayDuration, side, align]);

  return (
    <TooltipContext.Provider value={value}>
      {children}
      {open && content && (
        <div 
          className="absolute z-50 animate-in fade-in-0 zoom-in-95"
          style={{
            left: position.x,
            top: position.y,
            pointerEvents: "none"
          }}
        >
          {content}
        </div>
      )}
    </TooltipContext.Provider>
  );
}

export function Tooltip({ children }) {
  return <>{children}</>;
}

export function TooltipTrigger({ children, asChild }) {
  const context = React.useContext(TooltipContext);
  if (!context) throw new Error("TooltipTrigger must be used within a TooltipProvider");
  
  const { setOpen, setPosition, delayDuration } = context;
  const timeoutRef = React.useRef(null);
  
  const handleMouseEnter = (e) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY
    });
    
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delayDuration);
  };
  
  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 100);
  };
  
  const triggerProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter,
    onBlur: handleMouseLeave
  };
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, triggerProps);
  }
  
  return (
    <span {...triggerProps}>
      {children}
    </span>
  );
}

export function TooltipContent({ 
  children, 
  className, 
  side = "bottom", 
  align = "center",
  ...props 
}) {
  const context = React.useContext(TooltipContext);
  if (!context) throw new Error("TooltipContent must be used within a TooltipProvider");
  
  const { setContent, setSide, setAlign } = context;
  
  // Use a layout effect to set the content
  React.useLayoutEffect(() => {
    setSide(side);
    setAlign(align);
    setContent(
      <div 
        className={cn(
          "rounded-md px-3 py-1.5 text-sm shadow-md",
          "bg-slate-900 text-slate-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }, [children, className, side, align, setSide, setAlign, props]);
  
  // Separate effect for cleanup with no dependencies to avoid the circular dependency
  React.useEffect(() => {
    // Return a cleanup function that doesn't depend on setContent
    return () => {
      // Use setTimeout to break the render cycle
      setTimeout(() => {
        setContent(null);
      }, 0);
    };
  }, []); // Empty dependency array
  
  return null;
}