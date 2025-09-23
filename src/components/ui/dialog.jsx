import * as React from "react";
import { cn } from "../../lib/utils";

const DialogContext = React.createContext(null);

export function Dialog({ children, open = false, onOpenChange }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => onOpenChange && onOpenChange(false)}
            aria-hidden="true"
          />
          <div className="z-50 relative animate-in fade-in-0 zoom-in-95">
            {children}
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function DialogContent({ 
  children, 
  className,
  ...props 
}) {
  const context = React.useContext(DialogContext);
  
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}