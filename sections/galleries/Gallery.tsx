"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { GALLERY } from "@/config/content";

// Define Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

const Gallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof GALLERY[0] | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedPhoto(null); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div id="gallery" className="gallery w-full bg-[#fbfaf7] text-neutral-900 py-24 px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col gap-12 relative overflow-hidden select-none font-sans">
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-900/10 pb-6 gap-4">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 block mb-1">SELECTED WORKS</span>
          <SectionHeading title="STUDIO ARCHIVE" />
        </div>
      </div>

      {/* STAGGERED GRID */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-max w-full mt-4"
      >
        {GALLERY.map((photo) => (
          <motion.div
            key={photo.id}
            variants={itemVariants}
            onClick={() => setSelectedPhoto(photo)}
            className={`group relative bg-[#f5f4f0] border border-neutral-900/[0.06] p-2 transition-all duration-700 cursor-pointer hover:border-neutral-900/20 ${photo.className}`}
          >
            <div className="absolute top-0 left-0 w-full h-[2px] z-50 overflow-hidden">
              <div className="w-full h-full bg-neutral-900/80 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out" />
            </div>

            <motion.div layoutId={`photo-${photo.id}`} className="relative w-full h-full overflow-hidden bg-neutral-100">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                <p className="text-white text-[10px] font-mono tracking-widest uppercase">{photo.alt}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* INSPECTION MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <button 
              onClick={() => setSelectedPhoto(null)} 
              className="absolute top-4 right-4 z-50 font-mono text-lg text-neutral-400 bg-transparent hover:text-white hover:bg-black/50 w-16 h-16 flex items-center justify-center rounded-full uppercase transition-colors"
            >
              X
            </button>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md"
            />
            <motion.div
              layoutId={`photo-${selectedPhoto.id}`}
              className="relative w-full max-w-5xl bg-[#fbfaf7] border border-neutral-200 flex flex-col md:flex-row p-2 z-10 overflow-hidden shadow-2xl"
            >
              <button 
              {/* <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-50 font-mono text-[9px] tracking-widest text-neutral-400 hover:text-black border border-neutral-200 px-3 py-1.5 uppercase bg-white/50 backdrop-blur"
              >
                Close [x]
              </button>
              </button> */}

              <div className="relative w-full md:w-[65%] h-[40vh] md:h-[70vh] bg-neutral-100">
                <Image src={selectedPhoto.src} alt={selectedPhoto.alt} fill className="object-contain p-6" />
              </div>

              <div className="flex-1 p-8 flex flex-col justify-between font-mono">
                <div>
                  <span className="text-[10px] text-neutral-400">{selectedPhoto.id}</span>
                  {/* <span className="text-[10px] text-neutral-400">{selectedPhoto.id}</span> */}
                  <h2 className="text-xl font-bold uppercase mt-2">{selectedPhoto.alt}</h2>
                  <div className="mt-8 space-y-4 text-[10px] text-neutral-600">
                    <p>FOCAL: {selectedPhoto.dimensions}</p>
                    <p>SHUTTER: {selectedPhoto.shutter}</p>
                    <p>ISO: {selectedPhoto.iso}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;