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
        cameraRef,
        isCameraActive,
        isCapturing,
        toggleDropdown,
        handlePhotoLibraryClick,
        handleCameraClick,
        executeCapture,
        closeCamera,
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

            {/** Timeless background */}
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

            {/** Camera Panel */}
            {isCameraActive && (
                <div className="fixed inset-0 z-50 flex flrx-col justify-center items-center bg-blck/95 p-4 backdrop-blur-md">
                    <div className="relative w-full max-w-sm overflow-hidden rounded-xl bg-[#121212] border border-white/10 shadow-2xl">

                        <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/40 text-xs text-emerald-400 font-mono tracking-widest rounded boder border-emerald-500/20  animate-pulse">
                            LIVE STREAM
                        </div>

                        <video 
                            ref={cameraRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-96 object-cover bg-neutral-900"
                        />


                        <div className="flex justify-between items-center p-4 bg-[#1A1A1A] border-t border-white/5">
                            <button
                                type="button"
                                onClick={closeCamera}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={executeCapture}
                                disabled={isCapturing || isUploading}
                                className="px-6 py-3 bg-white rounded-full text-xs text-black font-bold shadow-lg hover:bg-gray-200 transition-all disabled:opacity-40 tracking-wider"
                            >
                                {isCapturing ? "CAPTURING..." : "TAKE SNAPSHOT"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default UploadMediaPanel;