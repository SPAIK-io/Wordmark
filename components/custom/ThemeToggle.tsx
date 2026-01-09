"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle({
  className,
  variant = "outline",
  size = "icon",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn("relative", className)}
        disabled
      >
        <Sun className="h-4 w-4" />
        {showLabel && <span className="ml-2">Theme</span>}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const currentTheme = theme || "system";
  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("relative", className)}
        >
          <CurrentIcon className="h-4 w-4" />
          {showLabel && (
            <span className="ml-2 capitalize">
              {currentTheme === "system" ? "System" : resolvedTheme}
            </span>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              currentTheme === value && "bg-accent/50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Simple toggle button that cycles through themes
 */
export function ThemeToggleSimple({
  className,
  variant = "ghost",
  size = "icon",
}: Omit<ThemeToggleProps, "showLabel">) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={toggleTheme}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;
