"use client";

import { useState, useEffect, useRef } from "react";
import { MdOutlineUpload } from "react-icons/md";

import { useUploadMedia } from "@/hooks/useUploadMedia";

interface UploadMediaPanelProps {
    isUploading: boolean;
    onUploadTrigger: (files: FileList | null) => Promise<boolean>
}

const UploadMediaPanel = ({
    isUploading,
    onUploadTrigger
}: UploadMediaPanelProps) => {
    const {
        date,
        isDisplay,
        fileInputRef,
        cameraInputRef,
        toggleDropdown,
        handlePhotoLibraryClick,
        handleCameraClick,
        handleFileChange,
    } = useUploadMedia({isUploading, onUploadTrigger})
    
    return (
        <div
            className="flex flex-col justify-center items-center w-full max-w-sm mx-auto"
        >
            {/** WHEN CLICKED PHOTO LIBRARY */}
            <input 
                title="photo library"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                multiple
            />

            {/** WHEN CLICKED TAKE PHOTO OR VIDEO */}
            <input 
                title="take photo or video"
                type="file"
                ref={cameraInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                capture="environment"
                className="hidden"
            />

            <div
                className="bg-[url(/images/gallery/wedding.png)] flex flex-col justify-end items-start px-4 pb-8 mb-4 h-96 w-full bg-no-repeat bg-cover bg-center rounded-md shadow-lg shadow-black/40"
            >
                <h3 className="text-xl bg-black/20 text-white/80 font-bold tracking-wide">Timeless Media Studio</h3>
                <span className="p-2 bg-black/20 rounded text-sm text-gray-300 text-shadow-lg">{date}</span>
            </div>

            <div className="relative w-full">
                <button
                    title="upload media"
                    onClick={toggleDropdown}
                    disabled={isUploading}
                    className="flex justify-center items-center gap-2 py-3 w-full bg-[#1A1A1A] border border-white/40 rounded-md"
                >
                    <MdOutlineUpload size="22"/>
                    <span className="tracking-widest font-medium">{isUploading ? "Uploading..." : "Upload Media"}</span>
                </button>

                <div
                    className={`absolute bottom-full left-0 flex-col justify-between py-1 mb-2 w-full h-fit bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] border border-white/10 rounded-xl text-start text-[#E8E8E8] shadow-2xl backdrop-blur=md transition-all duration-300 origin-bottom
                    ${isDisplay ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}    
                        `}
                >
                    <button
                        title="photo library"
                        onClick={handlePhotoLibraryClick}
                        className="p-3 w-full text-sm hover:bg-white/5 text-left transition-colors"
                    >
                        Photo Library
                    </button>
                    <button 
                        title="take photo or video"
                        onClick={handleCameraClick}
                        className="p-3 py-3 w-full text-sm border-t border-b border-white/15 hover:bg-white/5 text-left transition-colors"
                    >
                        Take Photo or Video
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UploadMediaPanel;