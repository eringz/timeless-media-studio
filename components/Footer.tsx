"use client";

import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const catalogSpecs = [
    { label: "ARCHIVE RATIO", value: "3:2 DIGITAL RAW" },
    { label: "STUDIO CORE", value: "MANILA / MAKATI" },
    { label: "COLLECTION", value: `VOL. ${currentYear}_EDITION` },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full bg-[#fbfaf7] text-black pt-20 pb-10 px-6 sm:px-12 lg:px-24 relative select-none font-sans"
    >
      {/* Editorial Fine Thin Border */}
      <div className="w-full h-[1px] bg-neutral-950/10 mb-16 flex justify-between items-center text-[10px] tracking-[0.2em] font-mono text-neutral-400">
        <span className="bg-[#fbfaf7] pr-4 uppercase">Timeless Media Studio</span>
        <span className="bg-[#fbfaf7] pl-4 uppercase">© {currentYear}</span>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          <div className="space-y-4 max-w-sm">
            <h3 className="text-xl font-bold tracking-widest uppercase font-sans text-neutral-900">
              FRONTDESK TEAM
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal tracking-wide">
              Documenting cinematic narratives, raw human interactions, and editorial atmospheres through structured light capture and deliberate frames.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-6 w-full md:w-auto justify-start md:justify-end">
            {catalogSpecs.map((spec, index) => (
              <div key={index} className="border-l border-neutral-300 pl-4 pr-8 py-1 flex flex-col justify-between">
                <span className="font-mono text-[9px] tracking-widest text-neutral-400 block mb-1">{spec.label}</span>
                <span className="text-xs font-bold font-mono tracking-wide text-neutral-800 uppercase">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-8 border-t border-neutral-950/5 text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-neutral-800 font-medium">Frontdesk Team Operations</span>
            <span>•</span>
            <span>All Frames Contained Remain Inherently Protected</span>
          </div>
          
          <motion.a 
            href="#hero" 
            whileHover={{ x: 5 }}
            className="text-neutral-500 hover:text-neutral-900 transition-colors duration-300 font-semibold tracking-widest"
          >
            [ Index Top ↑ ]
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;