"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  addToFavoritesAtom,
  currentVersionIndexAtom,
  FavoriteVersion,
  favoriteVersionsAtom,
  isCurrentVersionFavoritedAtom,
  removeFromFavoritesAtom,
  restoreFavoriteAtom,
  restoreVersionAtom,
  versionHistoryAtom,
} from "@/lib/versionHistory";
import { useAtom } from "jotai";
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ExportMenu } from "../ExportMenu";
import { ImportDialog } from "../ImportDialog";
import { FavoritesTabContent } from "./FavoritesTabContent";
import { HistoryTabContent } from "./HistoryTabContent";

const SCROLL_AMOUNT = 200;
const SCROLL_CENTERING_DELAY = 50;

export function VersionHistory() {
  const [history] = useAtom(versionHistoryAtom);
  const [currentIndex, setCurrentIndex] = useAtom(currentVersionIndexAtom);
  const [, restoreVersion] = useAtom(restoreVersionAtom);
  const [favorites] = useAtom(favoriteVersionsAtom);
  const [isCurrentFavorited] = useAtom(isCurrentVersionFavoritedAtom);
  const [, addToFavorites] = useAtom(addToFavoritesAtom);
  const [, removeFromFavorites] = useAtom(removeFromFavoritesAtom);
  const [, restoreFavorite] = useAtom(restoreFavoriteAtom);
  const [activeTab, setActiveTab] = useState<string>("history");
  const [favoriteName, setFavoriteName] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentCardRef = useRef<HTMLDivElement>(null);
  const prevHistoryLengthRef = useRef<number>(0);

  const handleVersionClick = (index: number) => {
    restoreVersion(index);
  };

  const handleFavoriteClick = (favorite: FavoriteVersion) => {
    restoreFavorite(favorite);
  };

  const handleFavoriteCurrentVersion = () => {
    if (isCurrentFavorited) {
      const currentVersion = history[currentIndex];
      const matchingFav = favorites.find(
        (fav) =>
          JSON.stringify({
            text: fav.text,
            card: fav.card,
            icon: fav.icon,
            layout: fav.layout,
            font: fav.font?.family,
          }) ===
          JSON.stringify({
            text: currentVersion.text,
            card: currentVersion.card,
            icon: currentVersion.icon,
            layout: currentVersion.layout,
            font: currentVersion.font?.family,
          }),
      );

      if (matchingFav) {
        removeFromFavorites(matchingFav.favoriteId);
      }
    } else {
      setIsDialogOpen(true);
    }
  };

  const addWithName = () => {
    addToFavorites(favoriteName);
    setFavoriteName("");
    setIsDialogOpen(false);
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (history.length === 0) return;

    const newVersionAdded = history.length > prevHistoryLengthRef.current;
    prevHistoryLengthRef.current = history.length;

    if (currentCardRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        if (!currentCardRef.current || !scrollContainerRef.current) return;

        const scrollContainer = scrollContainerRef.current;
        const containerWidth = scrollContainer.offsetWidth;
        const card = currentCardRef.current;
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = card.offsetLeft + cardRect.width / 2;
        const scrollCenterX = containerWidth / 2;
        const targetScrollLeft = cardCenterX - scrollCenterX;

        scrollContainer.scrollTo({
          left: targetScrollLeft,
          behavior: newVersionAdded ? "auto" : "smooth",
        });
      }, SCROLL_CENTERING_DELAY);
    }
  }, [currentIndex, history.length]);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 w-full max-w-full">
      <Tabs
        defaultValue="history"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="mb-2 flex items-center justify-between">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favorites.length})
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            {activeTab === "history" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteCurrentVersion}
                  className={cn(
                    "h-8 w-8 rounded-full",
                    isCurrentFavorited
                      ? "text-yellow-500"
                      : "text-muted-foreground",
                  )}
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      isCurrentFavorited && "fill-yellow-500",
                    )}
                  />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {history.length} versions
                </span>
              </>
            )}
            <div className="flex items-center">
              <ExportMenu />
              <ImportDialog />
            </div>
          </div>
        </div>

        <TabsContent value="history" className="mt-0">
          <HistoryTabContent
            history={history}
            currentIndex={currentIndex}
            scrollContainerRef={scrollContainerRef}
            currentCardRef={currentCardRef}
            onVersionClick={handleVersionClick}
            onScrollLeft={scrollLeft}
            onScrollRight={scrollRight}
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          <FavoritesTabContent
            favorites={favorites}
            onFavoriteClick={handleFavoriteClick}
            onRemove={removeFromFavorites}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save as Favorite</DialogTitle>
            <DialogDescription>
              Give your favorite design a name to help you remember it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="favorite-name" className="text-right">
                Name
              </Label>
              <Input
                id="favorite-name"
                value={favoriteName}
                onChange={(e) => setFavoriteName(e.target.value)}
                placeholder={`Favorite #${favorites.length + 1}`}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={addWithName}>
              Save Favorite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
