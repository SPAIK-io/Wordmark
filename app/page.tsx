"use client";

import { CommandPalette } from "@/components/CommandPalette";
import { ExportDialog } from "@/components/custom/ExportDialog";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs } from "@/components/ui/tabs";
import { Units } from "@/lib/constants";
import { getAllFontList } from "@/lib/fontProviders";
import { fontAtom, textAtom } from "@/lib/statemanager";
import { useAtom, useAtomValue } from "jotai";
import { Boxes, Download, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { ThemeToggleSimple } from "@/components/custom/ThemeToggle";
import { CardTab, IconTab, LayoutTab, MenuList, TextTab } from "./_tabs";
import { DisplayCard } from "./DisplayCard";
import {
  DownloadButton,
  downloadHandler,
  useDownloadStore,
} from "./DownloadButton";
import { RandomFontButton } from "./RandomFontButton";
import { VersionHistoryWrapper } from "./VersionHistoryWrapper";

export type UnitType = (typeof Units)[number];

export default function Home() {
  // Command palette state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [_, setSelectedFont] = useAtom(fontAtom);
  const textState = useAtomValue(textAtom);
  const { isLoading, currentFormat } = useDownloadStore();

  // Select a random font function
  const selectRandomFont = useCallback(() => {
    // Get all fonts
    const allFonts = getAllFontList();

    if (allFonts.length > 0) {
      // Select a random font from the list
      const randomIndex = Math.floor(Math.random() * allFonts.length);
      const randomFont = allFonts[randomIndex];

      // Set it as selected font
      setSelectedFont(randomFont);
    }
  }, [setSelectedFont]);

  return (
    <div className="relative flex min-h-screen flex-col-reverse justify-end space-y-2 space-y-reverse p-4 md:h-screen md:space-y-0">
      {/* Invisible DownloadButton to initialize the download handler */}
      <DownloadButton invisible />

      {/* Export dialog for batch exports */}
      <ExportDialog textContent={textState?.text} />

      {/* Keyboard shortcuts */}
      <KeyboardShortcuts
        onRandomFont={selectRandomFont}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Command palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onRandomFont={selectRandomFont}
      />

      {/* Desktop View - Resizable Layout */}
      <div className="hidden w-full md:block md:h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full rounded-lg border"
        >
          {/* Editor Panel */}
          <ResizablePanel defaultSize={40} minSize={30} className="h-full">
            <div className="flex h-full w-full flex-col">
              <div className="flex h-20 w-full flex-none flex-col items-center justify-center rounded-t-lg border-b bg-primary-foreground text-center text-gray-600 dark:text-gray-300">
                <div className="flex w-full items-center justify-between px-4">
                  <div className="w-8" /> {/* Spacer for balance */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <Boxes size={32} />
                      <span className="ml-2 text-center text-2xl font-semibold [text-wrap:balance]">
                        SPAIK.
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-xs text-muted-foreground">
                      <span>Internal Logomaker</span>
                    </div>
                  </div>
                  <ThemeToggleSimple size="sm" />
                </div>
              </div>

              <Tabs
                orientation="vertical"
                defaultValue="text"
                className="flex h-[calc(100%-5rem)] w-full flex-col bg-muted/80 md:flex-row md:overflow-auto"
              >
                <MenuList />
                <Separator orientation="vertical" className="hidden md:block" />
                <Separator orientation="horizontal" className="md:hidden" />
                {/* Tab Contents */}
                <TextTab />
                <CardTab />
                <IconTab />
                <LayoutTab />
              </Tabs>
            </div>
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle withHandle />

          {/* Preview Panel */}
          <ResizablePanel defaultSize={60}>
            <div className="flex h-full w-full flex-col items-center justify-center bg-background p-4">
              <div className="flex flex-1 flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <DisplayCard />

                  <div className="flex gap-2">
                    <RandomFontButton onRandomFont={selectRandomFont} />
                    <DropdownMenu>
                      <DropdownMenuTrigger className="" asChild>
                        <Button
                          variant="outline"
                          disabled={isLoading}
                          className="flex gap-1.5"
                        >
                          {isLoading ? (
                            <Loader2 size={18} className="mr-1 animate-spin" />
                          ) : (
                            <Download size={18} />
                          )}
                          <span className="text-sm font-medium">
                            {isLoading ? "Processing..." : "Download"}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="bg-background/90 backdrop-blur-sm"
                      >
                        {["PNG", "SVG", "JPEG"].map((format, i) => (
                          <DropdownMenuItem
                            key={i}
                            onClick={() =>
                              downloadHandler.download(
                                format.toLowerCase() as any,
                              )
                            }
                            className="cursor-pointer px-3 py-1.5 text-xs transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isLoading}
                          >
                            {isLoading &&
                            currentFormat === format.toLowerCase() ? (
                              <Loader2
                                size={14}
                                className="mr-1 animate-spin"
                              />
                            ) : null}
                            {format}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              <VersionHistoryWrapper />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile View - Stacked Layout */}
      <div className="flex w-full flex-col md:hidden">
        <div className="flex h-20 w-full flex-col items-center justify-center rounded-lg border bg-primary-foreground text-center">
          <div className="flex w-full items-center justify-between px-4">
            <div className="w-8" /> {/* Spacer for balance */}
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <Boxes size={28} />
                <span className="ml-2 text-center text-xl font-semibold [text-wrap:balance]">
                  SPAIK.
                </span>
              </div>
              <div className="mt-1 flex items-center justify-center text-xs text-muted-foreground">
                <span>Internal Logomaker</span>
              </div>
            </div>
            <ThemeToggleSimple size="sm" />
          </div>
        </div>

        <div className="relative mt-2 flex h-1/3 w-full flex-col items-center justify-center rounded-lg border p-4">
          <div className="flex w-full flex-1 items-center justify-center">
            <DisplayCard />
          </div>
          <div className="mt-2">
            <div className="flex gap-2">
              <RandomFontButton onRandomFont={selectRandomFont} />
              <DropdownMenu>
                <DropdownMenuTrigger className="" asChild>
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    className="flex gap-1.5"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="mr-1 animate-spin" />
                    ) : (
                      <Download size={18} />
                    )}
                    <span className="text-sm font-medium">
                      {isLoading ? "Processing..." : "Download"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="bg-background/90 backdrop-blur-sm"
                >
                  {["PNG", "SVG", "JPEG"].map((format, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() =>
                        downloadHandler.download(format.toLowerCase() as any)
                      }
                      className="cursor-pointer px-3 py-1.5 text-xs transition-colors hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {isLoading && currentFormat === format.toLowerCase() ? (
                        <Loader2 size={14} className="mr-1 animate-spin" />
                      ) : null}
                      {format}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <VersionHistoryWrapper />
        </div>

        <aside className="mt-2 flex max-h-[calc(100vh-300px)] w-full flex-col overflow-hidden">
          <Tabs
            orientation="vertical"
            defaultValue="text"
            className="flex h-full w-full flex-col overflow-y-auto rounded-lg border bg-muted/80"
          >
            <MenuList />
            <Separator orientation="horizontal" />
            <TextTab />
            <CardTab />
            <IconTab />
            <LayoutTab />
          </Tabs>
        </aside>

        {/* Mobile footer */}
        <div className="mt-2 flex flex-row items-center justify-center rounded-lg border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            SPAIK Logomaker - Internal Tool
          </span>
        </div>
      </div>
    </div>
  );
}
