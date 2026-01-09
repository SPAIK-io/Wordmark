"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Bookmark } from "lucide-react";
import { FavoriteCard } from "./FavoriteCard";
import { FavoritesTabContentProps } from "./types";

export function FavoritesTabContent({
  favorites,
  onFavoriteClick,
  onRemove,
}: FavoritesTabContentProps) {
  if (favorites.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <Bookmark className="mx-auto mb-2 h-8 w-8 opacity-50" />
        <p>No favorites yet</p>
        <p className="mt-1 text-xs">
          Star your favorite versions to save them here
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <ScrollArea className="w-full pb-2">
        <div className="grid grid-cols-2 gap-4 p-2 sm:grid-cols-3 md:grid-cols-4">
          {favorites.map((favorite) => (
            <FavoriteCard
              key={favorite.favoriteId}
              favorite={favorite}
              onClick={() => onFavoriteClick(favorite)}
              onRemove={() => onRemove(favorite.favoriteId)}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
