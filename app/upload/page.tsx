"use client"
import { useState } from "react";

import { MdOutlineUpload } from "react-icons/md";
import { BiPhotoAlbum } from "react-icons/bi";


const Upload = () => {
    const [isDisplay, setIsDisplay] = useState(false);
    return (
        <div className="flex flex-col justify-center  items-center py-8 h-screen">
            <div
                className="bg-[url(/images/gallery/wedding.png)] flex flex-col justify-end items-start px-4 pb-8 mb-4 h-96 w-80 bg-fit bg-center rounded-md shadow-lg shadow-gray-500"
            >
                <h3 className="text-xl text-white font-bold">Timeless Media Studio</h3>
                <span className="text-white">May 17 2026</span>
            </div>
            <div className="flex flex-col justify-center gap-4 w-full">
                { isDisplay && 
                    <div className="absolute top-92 left-16 flex flex-col  justify-between py-1  h-fit w-64 bg-gradient-to-b from-[#303030]/90 via-20% via-[#1A1A1A] to-[#303030]/90 via-20% hover:bg-[#1A1A1A] rounded-md text-start text-[#E8E8E8]">
                        <div className="p-2"> Photo Library</div>
                        <div className="p-2 border-t border-b border-white/20 py-2">Take Photo or Video</div>
                        <div className="p-2">Choose Files</div>
                    </div>}
                <button
                    onClick={() => setIsDisplay(!isDisplay) }
                    className="flex justify-center items-center gap-2 w-full py-3 bg-gradient-to-b from-[#303030]/90 via-20% via-[#1A1A1A] to-[#303030]/90 via-20% hover:bg-[#1A1A1A]  text-white text-md border border-white/40 rounded-md"
                >
                    <span className=""><MdOutlineUpload size="25" /></span> 
                    <span className="tracking-widest">Upload Media</span>
                </button>
                <button
                    onClick={() => alert("Album")}
                    className="flex justify-center items-center gap-2 w-full py-3 bg-gradient-to-b from-[#303030]/90 via-20% via-[#1A1A1A] to-[#303030]/90 via-20% text-white text-md border border-white/40 rounded-md"
                >
                    <span className=""><BiPhotoAlbum /></span> 
                    <span className="tracking-widest">View Album</span>
                </button>
            </div>
        </div>
    )
}

export default Upload;
