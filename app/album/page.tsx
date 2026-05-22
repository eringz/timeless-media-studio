"use client";
import React from "react";
import Link from "next/link";
import { useMediaGallery } from "@/hooks/useMediaGallery";
import MediaAlbumGrid from "@/features/media/MediaAlbumGrid";

export default function AlbumPage() {
  const { mediaList, isLoadingAlbum } = useMediaGallery();

  return (
    <div className="min-h-screen text-zinc-100 md:p-8 flex flex-col gap-6">
      <div 
        className="relative flex items-center justify-between px-6 md:px-12 w-screen h-96 border-b border-zinc-800 pb-4 overflow-hidden
          before:content-[''] before:absolute before:inset-0 
          before:bg-[url(/images/gallery/wedding.png)] before:bg-cover before:bg-center 
          before:blur-sm before:scale-105"
      >
        
        <div className="absolute inset-0 bg-black/40 z-0" />
          <div
            className="relative z-10 flex flex-col w-full"
          >
            <h1 className="mt-40 text-2xl md:text-3xl font-bold tracking-wide text-white/60 text-center flex-1 drop-shadow-md drop-shadow-white/20">
              Timeless Media Studio 
            </h1>

            <div className="flex justify-between mt-16 w-full text-xs drop-shadow-lg drop-shadow-white/20">
              <button className="px-8 py-4 bg-[#1A1A1A] rounded">Gallery Upload</button>
              <Link href="/studio" className="px-8 py-4 bg-black rounded">Back to Media</Link>
            </div>

            <div className="w-28 hidden md:block"></div> 
          </div>      
      </div>

      <main className="w-full max-w-6xl mx-auto flex-1 px-4 md:px-0">
        <MediaAlbumGrid 
          media={mediaList} 
          loading={isLoadingAlbum} 
        />
      </main>

    </div>
  );
}