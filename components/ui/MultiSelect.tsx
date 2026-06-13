"use client";

import type { SelectOption } from "@/types";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  className,
}: MultiSelectProps) {
  function toggleOption(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  }

  return (
    <div
      className={cn(
        "rounded-md border border-foreground/20 bg-background p-3 space-y-2 max-h-48 overflow-y-auto",
        className,
      )}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-foreground/5 rounded px-1 py-0.5"
        >
          <input
            type="checkbox"
            checked={value.includes(option.value)}
            onChange={() => toggleOption(option.value)}
            className="rounded border-foreground/30"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
