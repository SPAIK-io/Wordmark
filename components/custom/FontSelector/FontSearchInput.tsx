"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface FontSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function FontSearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search fonts...",
}: FontSearchInputProps) {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 flex items-center pl-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        className="h-8 pl-8 pr-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={onClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
