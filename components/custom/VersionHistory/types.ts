import { DesignVersion, FavoriteVersion } from "@/lib/versionHistory";

export interface VersionCardProps {
  version: DesignVersion;
  isActive: boolean;
  onClick: () => void;
}

export interface FavoriteCardProps {
  favorite: FavoriteVersion;
  onClick: () => void;
  onRemove: () => void;
}

export interface HistoryTabContentProps {
  history: DesignVersion[];
  currentIndex: number;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  currentCardRef: React.RefObject<HTMLDivElement>;
  onVersionClick: (index: number) => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export interface FavoritesTabContentProps {
  favorites: FavoriteVersion[];
  onFavoriteClick: (favorite: FavoriteVersion) => void;
  onRemove: (favoriteId: string) => void;
}

// Scale factors for card previews
export const VERSION_CARD_SCALE = 0.15;
export const FAVORITE_CARD_SCALE = 0.2;

// Minimum dimensions for scaled cards
export const MIN_VERSION_CARD_WIDTH = 60;
export const MIN_VERSION_CARD_HEIGHT = 34;
export const MIN_FAVORITE_CARD_WIDTH = 80;
export const MIN_FAVORITE_CARD_HEIGHT = 45;
