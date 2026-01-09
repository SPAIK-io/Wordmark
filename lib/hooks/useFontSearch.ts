"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import Fuse from "fuse.js";
import {
  clearFontCache,
  ExtendedFontItem,
  getAllFontList,
  getAvailableProviders,
  getFontsByProvider,
  loadMoreFontsByProvider,
} from "@/lib/fontProviders";
import { onFontProviderEvent } from "@/lib/fontProviders/events";
import {
  FontProviderType,
  FontFilterState,
  CATEGORY_MAPPINGS,
  WEIGHT_VARIANT_MAP,
  STYLE_VARIANT_MAP,
  FONTS_PER_PAGE,
  FONT_CATEGORIES,
  FONT_WEIGHTS,
  FONT_STYLES,
} from "@/components/custom/FontSelector/types";

interface UseFontSearchOptions {
  activeProvider: FontProviderType;
  searchTerm: string;
  filters: FontFilterState;
}

interface UseFontSearchResult {
  fonts: ExtendedFontItem[];
  totalFonts: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  status: "pending" | "error" | "success";
  categoryCounts: Record<string, number>;
  weightCounts: Record<string, number>;
  styleCounts: Record<string, number>;
  allProviders: string[];
}

const FUSE_OPTIONS = {
  keys: ["family"],
  threshold: 0.3,
  isCaseSensitive: false,
};

export function useFontSearch({
  activeProvider,
  searchTerm,
  filters,
}: UseFontSearchOptions): UseFontSearchResult {
  const [allProviders, setAllProviders] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Initialize providers and listen for font updates
  useEffect(() => {
    setAllProviders(getAvailableProviders());

    const handleFontUpdate = () => {
      clearFontCache("all");
      clearFontCache(`provider_${activeProvider}`);
      setAllProviders(getAvailableProviders());
      queryClient.invalidateQueries({
        queryKey: ["fonts", activeProvider, searchTerm],
      });
    };

    const unsubscribe1 = onFontProviderEvent("fontSourceUpdated", handleFontUpdate);
    const unsubscribe2 = onFontProviderEvent("fontProviderUpdated", handleFontUpdate);
    const unsubscribe3 = onFontProviderEvent("openFoundryUpdated", handleFontUpdate);

    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    };
  }, [activeProvider, searchTerm, queryClient]);

  // Get all fonts from the active provider
  const getAllProviderFonts = useCallback((): ExtendedFontItem[] => {
    if (activeProvider === "all") {
      return getAllFontList();
    }
    return getFontsByProvider(activeProvider);
  }, [activeProvider]);

  // Apply filters to font list
  const applyFilters = useCallback(
    (fonts: ExtendedFontItem[]): ExtendedFontItem[] => {
      let filtered = fonts;

      // Apply category filter
      if (filters.category !== "all") {
        const targetCategories = CATEGORY_MAPPINGS[filters.category] || [filters.category];
        filtered = filtered.filter((font) => {
          if (targetCategories.includes(font.category?.toLowerCase())) {
            return true;
          }
          const familyName = font.family.toLowerCase();
          return targetCategories.some((cat) =>
            familyName.includes(cat.toLowerCase())
          );
        });
      }

      // Apply weight filter
      if (filters.weight !== "all") {
        const targetWeights = WEIGHT_VARIANT_MAP[filters.weight] || [];
        filtered = filtered.filter((font) => {
          const hasMatchingVariant = font.variants.some((v) =>
            targetWeights.some((tw) =>
              v.toLowerCase().includes(tw.toLowerCase())
            )
          );
          const familyIncludesWeight = targetWeights.some((tw) =>
            font.family.toLowerCase().includes(tw.toLowerCase())
          );
          return hasMatchingVariant || familyIncludesWeight;
        });
      }

      // Apply style filter
      if (filters.style !== "all") {
        const targetStyles = STYLE_VARIANT_MAP[filters.style] || [filters.style];
        filtered = filtered.filter((font) => {
          const hasVariant = font.variants.some((v) =>
            targetStyles.some((ts) =>
              v.toLowerCase().includes(ts.toLowerCase())
            )
          );
          const familyName = font.family.toLowerCase();
          const familyHasStyle = targetStyles.some((ts) =>
            familyName.includes(ts.toLowerCase())
          );
          return hasVariant || familyHasStyle;
        });
      }

      return filtered;
    },
    [filters]
  );

  // React Query for infinite loading
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [
        "fonts",
        activeProvider,
        searchTerm,
        filters.category,
        filters.weight,
        filters.style,
      ],
      queryFn: async ({ pageParam = 0 }) => {
        let fonts: ExtendedFontItem[] = [];

        if (activeProvider === "all") {
          fonts = getAllFontList();
        } else {
          fonts = getFontsByProvider(activeProvider);

          if (pageParam > 0 && activeProvider === "fontSquirrel") {
            await loadMoreFontsByProvider(activeProvider);
            fonts = getFontsByProvider(activeProvider);
          }
        }

        // Apply fuzzy search
        if (searchTerm) {
          const fuse = new Fuse(fonts, FUSE_OPTIONS);
          const result = fuse.search(searchTerm);
          fonts = result.map((item) => item.item);
        }

        // Apply filters
        fonts = applyFilters(fonts);

        // Paginate
        const offset = pageParam * FONTS_PER_PAGE;
        const end = offset + FONTS_PER_PAGE;
        const items = fonts.slice(offset, end);
        const hasMore = end < fonts.length;

        return {
          items,
          nextPage: hasMore ? pageParam + 1 : null,
          totalCount: fonts.length,
        };
      },
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 0,
    });

  // Combine all pages
  const fonts = useMemo<ExtendedFontItem[]>(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const totalFonts = useMemo(() => {
    return data?.pages[0]?.totalCount || 0;
  }, [data]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    FONT_CATEGORIES.forEach((cat) => {
      if (cat.value !== "all") counts[cat.value] = 0;
    });

    const allProviderFonts = getAllProviderFonts();
    counts.all = allProviderFonts.length;

    allProviderFonts.forEach((font) => {
      Object.entries(CATEGORY_MAPPINGS).forEach(([category, mappings]) => {
        if (
          mappings.includes(font.category?.toLowerCase() || "") ||
          mappings.some((m) => font.family.toLowerCase().includes(m.toLowerCase()))
        ) {
          counts[category] = (counts[category] || 0) + 1;
        }
      });
    });

    return counts;
  }, [getAllProviderFonts]);

  // Calculate weight counts
  const weightCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    FONT_WEIGHTS.forEach((weight) => {
      if (weight.value !== "all") counts[weight.value] = 0;
    });

    const allProviderFonts = getAllProviderFonts();
    counts.all = allProviderFonts.length;

    allProviderFonts.forEach((font) => {
      Object.entries(WEIGHT_VARIANT_MAP).forEach(([weight, terms]) => {
        const hasMatchingVariant = font.variants.some((v) =>
          terms.some((term) => v.toLowerCase().includes(term.toLowerCase()))
        );
        const familyIncludesWeight = terms.some((term) =>
          font.family.toLowerCase().includes(term.toLowerCase())
        );
        if (hasMatchingVariant || familyIncludesWeight) {
          counts[weight] = (counts[weight] || 0) + 1;
        }
      });
    });

    return counts;
  }, [getAllProviderFonts]);

  // Calculate style counts
  const styleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    FONT_STYLES.forEach((style) => {
      if (style.value !== "all") counts[style.value] = 0;
    });

    const allProviderFonts = getAllProviderFonts();
    counts.all = allProviderFonts.length;

    allProviderFonts.forEach((font) => {
      Object.entries(STYLE_VARIANT_MAP).forEach(([style, terms]) => {
        const hasVariant = font.variants.some((v) =>
          terms.some((term) => v.toLowerCase().includes(term.toLowerCase()))
        );
        const familyName = font.family.toLowerCase();
        const familyHasStyle = terms.some((term) =>
          familyName.includes(term.toLowerCase())
        );
        if (hasVariant || familyHasStyle) {
          counts[style] = (counts[style] || 0) + 1;
        }
      });
    });

    return counts;
  }, [getAllProviderFonts]);

  return {
    fonts,
    totalFonts,
    isLoading: status === "pending",
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    status,
    categoryCounts,
    weightCounts,
    styleCounts,
    allProviders,
  };
}
