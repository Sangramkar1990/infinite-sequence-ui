// components/SearchInput.tsx
import { useTransition, useState } from 'react';
import { Search } from 'lucide-react';


type SearchInputProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function Input({
  placeholder = 'Search techniques...',
  value,
  onChange,
  className = '',
}: SearchInputProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative w-full max-w-md">
      <Search
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          startTransition(() => onChange(e));
        }}
        className={`pl-10 pr-3 h-9 w-full rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      />
    </div>
  );
}
