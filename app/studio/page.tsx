// @/app/studio/page.tsx
"use client";
import React from "react";
import Link from "next/link"; // Inimport ang Link para sa navigation
import { useMediaGallery } from "@/hooks/useMediaGallery";
import UploadMediaPanel from "@/features/media/UploadMediaPanel";

export default function TimelessStudioDashboard() {
  const { 
    isUploading, 
    error, 
    uploadMediaBatch 
  } = useMediaGallery();

  return (
    <div className="min-h-screen w-96 text-zinc-100 p-6 flex flex-col gap-4 items-center mx-auto">
      
      {error && (
        <div className="w-full max-w-sm rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 text-center animate-pulse">
          {error}
        </div>
      )}

      <section className="w-full">
        <UploadMediaPanel 
          isUploading={isUploading} 
          onUploadTrigger={uploadMediaBatch} 
        />
      </section>

      <section className="w-full">
        <Link
          href="/album"
          className="flex justify-center items-center gap-2 w-full py-3 bg-gradient-to-b from-[#303030]/90 via-20% via-[#1A1A1A] to-[#303030]/90 via-20% text-white text-md border border-white/40 rounded-md hover:opacity-90 transition-opacity text-center block"
        >
          <span className="tracking-widest">View Album</span>
        </Link>
      </section>

    </div>
  );
}