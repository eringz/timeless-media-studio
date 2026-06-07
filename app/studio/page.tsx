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
    <div className="flex flex-col items-center p-6 min-h-screen bg-[#0A0A0A] text-zinc-100">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        {error && (
          <div className="p-3 w-full rounded-lg bg-red-500/10 border border-red-500/20 text-xa text-red-400 text-center animate-pulse">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl shadow-2xl border border-white/5">
          <UploadMediaPanel 
            isUploading={isUploading}
            onUploadTrigger={uploadMediaBatch}
          />
        </div>

      </div>
    </div>
  );
}