// components/ui/Select.tsx
import { useState, useRef, useEffect, useTransition } from 'react';

type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
};

export function Select({ value, onValueChange, children }: SelectProps) {
  return <div className="relative inline-block">{children}</div>;
}

type SelectTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

export function SelectTrigger({ children, className = '' }: SelectTriggerProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      aria-haspopup="listbox"
      aria-expanded="false"
    >
      {children}
    </button>
  );
}

type SelectValueProps = {
  placeholder: string;
};

export function SelectValue({ placeholder }: SelectValueProps) {
  return <span className="text-gray-400">{placeholder}</span>;
}

type SelectContentProps = {
  children: React.ReactNode;
};

export function SelectContent({ children }: SelectContentProps) {
  return (
    <ul
      className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white py-1 text-sm shadow-lg focus:outline-none"
      role="listbox"
    >
      {children}
    </ul>
  );
}

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
};

export function SelectItem({ value, children }: SelectItemProps) {
  const [isPending, startTransition] = useTransition();
  const selectContext = useRef<HTMLDivElement | null>(null);

  return (
    <li
      role="option"
      tabIndex={0}
      onClick={() => {
        startTransition(() => {
          const customEvent = new CustomEvent('select-item-selected', {
            detail: value,
            bubbles: true,
          });
          document.dispatchEvent(customEvent);
        });
      }}
      className="cursor-pointer select-none px-4 py-2 text-gray-700 hover:bg-blue-100"
    >
      {children}
    </li>
  );
}
