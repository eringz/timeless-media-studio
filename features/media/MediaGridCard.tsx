// @/components/MediaGridCard.tsx
import React from "react";
import { MediaItem } from "@/hooks/useMediaGallery";
import { getBentoGridClasses } from "@/utils/grid/gridHelpers";

interface MediaGridCardProps {
  item: MediaItem;
  index: number;
}

export function MediaGridCard({ item, index }: MediaGridCardProps) {
  const gridSpanClass = getBentoGridClasses(index);

  return (
    <div
      className={`group relative overflow-hidden rounded drop-shadow-md drop-shadow-blue-900/40 transition-all duration-300 hover:border-cyan-500/40 ${gridSpanClass}`}
    >
      <img
        src={item.file_url}
        alt={item.file_name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="truncate text-xs font-medium text-zinc-200">{item.file_name}</p>
      </div>
    </div>
  );
}