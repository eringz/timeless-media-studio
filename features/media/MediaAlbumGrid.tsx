"use client";
import React from "react";
import { MediaItem } from "@/hooks/useMediaGallery";
import { MediaGridCard } from "@/features/media/MediaGridCard";

interface MediaAlbumGridProps {
  media: MediaItem[];
  loading: boolean;
}

export default function MediaAlbumGrid({ media, loading }: MediaAlbumGridProps) {
  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center w-full">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="text-center p-8 rounded-xl text-zinc-500 w-full max-w-sm mx-auto">
        No images yet.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="text-center md:text-left max-w-sm md:max-w-none mx-auto">
        <h2 className="text-lg font-bold tracking-wider uppercase text-zinc-400 text-xs">
          Gallery Records ({media.length})
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px]">
        {media.map((item, index) => (
          <MediaGridCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}