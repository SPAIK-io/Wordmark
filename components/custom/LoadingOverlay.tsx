"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  isLoading: boolean;
  /** Loading message to display */
  message?: string;
  /** Progress percentage (0-100), shows progress bar when provided */
  progress?: number;
  /** Additional CSS classes */
  className?: string;
  /** Make overlay fixed instead of absolute */
  fixed?: boolean;
  /** Blur the background */
  blur?: boolean;
}

/**
 * Loading overlay component for displaying loading states
 */
export function LoadingOverlay({
  isLoading,
  message = "Loading...",
  progress,
  className,
  fixed = false,
  blur = true,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "inset-0 z-50 flex flex-col items-center justify-center gap-4",
        fixed ? "fixed" : "absolute",
        blur ? "bg-background/80 backdrop-blur-sm" : "bg-background/95",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />

      {message && (
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      )}

      {progress !== undefined && (
        <div className="w-48">
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Inline loading spinner for smaller components
 */
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2
      className={cn("animate-spin text-muted-foreground", sizeClasses[size], className)}
    />
  );
}

/**
 * Loading skeleton for placeholder content
 */
interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-muted"
          style={{
            width: i === lines - 1 && lines > 1 ? "60%" : "100%",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Full page loading state
 */
interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export default LoadingOverlay;
