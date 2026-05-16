"use client"

import { MdOutlineUpload } from "react-icons/md";


const Upload = () => {
    return (
        <div className="flex flex-col justify-center  items-center p-24  h-screen">
            <div
                className="bg-[url(/images/camera.png)] mb-8 h-96 w-80 bg-cover bg-center rounded-lg shadow-lg shadow-gray-500"
            >

            </div>
            <div className="flex justify-center w-full">
                <button
                    onClick={() => alert("Media")}
                    className="flex justify-center items-center gap-2 w-full py-4 bg-black text-white text-xl border border-white/40 rounded-md"
                >
                    <span className=""><MdOutlineUpload size="25" /></span> 
                    <span className="tracking-widest">Upload Media</span>
            </button>

            </div>
            
        </div>
    )
}

export default Upload;