"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Monitor, Smartphone, Tablet, CreditCard, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type MockupType =
  | "browser"
  | "mobile"
  | "tablet"
  | "business-card"
  | "email"
  | "favicon";

interface MockupPreviewProps {
  children: React.ReactNode;
  className?: string;
  defaultMockup?: MockupType;
}

export function MockupPreview({
  children,
  className,
  defaultMockup = "browser",
}: MockupPreviewProps) {
  const [activeMockup, setActiveMockup] = useState<MockupType>(defaultMockup);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-center gap-2">
        <MockupSelector value={activeMockup} onChange={setActiveMockup} />
      </div>

      <div className="flex items-center justify-center">
        <MockupFrame type={activeMockup}>{children}</MockupFrame>
      </div>
    </div>
  );
}

interface MockupSelectorProps {
  value: MockupType;
  onChange: (type: MockupType) => void;
}

function MockupSelector({ value, onChange }: MockupSelectorProps) {
  const mockups: { type: MockupType; icon: React.ReactNode; label: string }[] = [
    { type: "browser", icon: <Monitor className="h-4 w-4" />, label: "Browser" },
    { type: "mobile", icon: <Smartphone className="h-4 w-4" />, label: "Mobile" },
    { type: "tablet", icon: <Tablet className="h-4 w-4" />, label: "Tablet" },
    { type: "business-card", icon: <CreditCard className="h-4 w-4" />, label: "Card" },
    { type: "email", icon: <Mail className="h-4 w-4" />, label: "Email" },
    { type: "favicon", icon: <Globe className="h-4 w-4" />, label: "Favicon" },
  ];

  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      {mockups.map(({ type, icon, label }) => (
        <Button
          key={type}
          variant={value === type ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onChange(type)}
          className="gap-1.5"
        >
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}

interface MockupFrameProps {
  type: MockupType;
  children: React.ReactNode;
}

function MockupFrame({ type, children }: MockupFrameProps) {
  switch (type) {
    case "browser":
      return <BrowserMockup>{children}</BrowserMockup>;
    case "mobile":
      return <MobileMockup>{children}</MobileMockup>;
    case "tablet":
      return <TabletMockup>{children}</TabletMockup>;
    case "business-card":
      return <BusinessCardMockup>{children}</BusinessCardMockup>;
    case "email":
      return <EmailMockup>{children}</EmailMockup>;
    case "favicon":
      return <FaviconMockup>{children}</FaviconMockup>;
    default:
      return <>{children}</>;
  }
}

function BrowserMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-t-lg border-x border-t bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1">
            <div className="mx-auto w-64 rounded bg-muted px-3 py-1 text-center text-xs text-muted-foreground">
              yoursite.com
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-b-lg border bg-background p-8">
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}

function MobileMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="w-[280px] rounded-[2.5rem] border-4 border-foreground/20 bg-background p-2">
        <div className="mx-auto mb-2 h-6 w-24 rounded-full bg-foreground/10" />
        <div className="aspect-[9/16] rounded-2xl border bg-muted/20 p-4">
          <div className="flex h-full items-center justify-center">
            <div className="scale-75">{children}</div>
          </div>
        </div>
        <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-foreground/10" />
      </div>
    </div>
  );
}

function TabletMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="w-[500px] rounded-[1.5rem] border-4 border-foreground/20 bg-background p-2">
        <div className="mx-auto mb-2 h-2 w-16 rounded-full bg-foreground/10" />
        <div className="aspect-[4/3] rounded-xl border bg-muted/20 p-6">
          <div className="flex h-full items-center justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}

function BusinessCardMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="perspective-1000">
      <div
        className="w-[350px] rounded-lg border bg-white p-6 shadow-xl dark:bg-zinc-900"
        style={{ aspectRatio: "3.5/2" }}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="scale-50 origin-top-left">{children}</div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-muted-foreground">John Doe</p>
            <p className="text-[10px] text-muted-foreground">CEO & Founder</p>
            <p className="text-[10px] text-muted-foreground">hello@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-lg">
      <div className="rounded-t-lg border-x border-t bg-muted/50 px-4 py-3">
        <div className="space-y-1 text-sm">
          <div className="flex gap-2">
            <span className="text-muted-foreground">From:</span>
            <span>no-reply@yoursite.com</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted-foreground">Subject:</span>
            <span>Welcome to Our Platform!</span>
          </div>
        </div>
      </div>
      <div className="rounded-b-lg border bg-background p-6">
        <div className="mb-4 flex items-center justify-center border-b pb-4">
          <div className="scale-90">{children}</div>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Hello!</p>
          <p>Welcome to our platform. We&apos;re excited to have you on board.</p>
          <p className="pt-2">Best regards,</p>
          <p>The Team</p>
        </div>
      </div>
    </div>
  );
}

function FaviconMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded border bg-background">
            <div className="scale-[0.15]">{children}</div>
          </div>
          <p className="text-xs text-muted-foreground">16px</p>
        </div>
        <div className="text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded border bg-background">
            <div className="scale-[0.25]">{children}</div>
          </div>
          <p className="text-xs text-muted-foreground">32px</p>
        </div>
        <div className="text-center">
          <div className="mb-2 flex h-24 w-24 items-center justify-center rounded-lg border bg-background">
            <div className="scale-50">{children}</div>
          </div>
          <p className="text-xs text-muted-foreground">64px</p>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-background">
            <div className="scale-[0.12]">{children}</div>
          </div>
          <span className="text-sm">Your Site Title</span>
          <span className="ml-auto text-xs text-muted-foreground">×</span>
        </div>
      </div>
    </div>
  );
}

export default MockupPreview;
