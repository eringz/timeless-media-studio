"use client";

import React from "react";

const Carousel = () => {
  const items = [
    "Photography", "Birthday Events", "Weddings", 
    "Debuts", "Concerts", "Family Shoot", 
    "Prenup", "Travel Photography"
  ];

  return (
    <div className="w-full bg-[#fbfaf7] py-6 overflow-hidden select-none relative z-10">
      {/* Upper Border Technical Alignment Line */}
      <div className="w-full h-[1px] bg-neutral-900/10 mb-2" />

      {/* Main Data Ticker Track Container */}
      <div className="w-full overflow-hidden bg-neutral-950 py-3.5 relative flex border-y border-neutral-800">
        
        {/* Subtle Lens Viewfinder Dots on Edges */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse z-20" />

        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-pointer pl-8 md:pl-12">
          
          {/* First Data Block */}
          <div className="flex items-center gap-6 text-xl sm:text-2xl font-black font-sans text-white tracking-widest uppercase">
            {items.map((item, index) => (
              <React.Fragment key={`group-1-${index}`}>
                <span>{item}</span>
                <span className="font-mono text-neutral-600 font-normal text-sm sm:text-base px-2">
                  •
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-6 text-xl sm:text-2xl font-black font-sans text-white tracking-widest uppercase ml-6">
            {items.map((item, index) => (
              <React.Fragment key={`group-2-${index}`}>
                <span>{item}</span>
                <span className="font-mono text-neutral-600 font-normal text-sm sm:text-base px-2">
                  •
                </span>
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>

      <div className="w-full h-[1px] bg-neutral-900/10 mt-2" />
    </div>
  );
};

export default Carousel;