"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import Image from "next/image";
import { SERVICES } from "@/config/content";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 3.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const Services = () => {
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedService(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div id="services" className="services flex flex-col gap-12 p-6 sm:p-12 md:p-24 bg-[#fbfaf7] text-black w-full relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900/10 pb-6 gap-4">
        <SectionHeading title="Services" />
        {/* <span className="font-mono text-[10px] text-neutral-400 tracking-[0.2em] uppercase">[ SYS_CAPABILITIES_LOG // ACTIVE_MODULES ]</span> */}
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10"
      >
        {SERVICES.map((service, index) => (
          <motion.div key={index} variants={cardVariants}>
            <button
              onClick={() => setSelectedService(service)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative overflow-hidden border border-neutral-900/10 bg-white p-2 h-[380px] w-full flex flex-col text-left transition-all duration-500 hover:border-neutral-900"
            >
              <motion.div 
                className="absolute top-0 left-0 h-[2px] bg-neutral-900"
                initial={{ width: 0 }}
                animate={{ width: hoveredIndex === index ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              />

              <div className="relative w-full h-[65%] overflow-hidden bg-neutral-900">
                <Image src={service.image} alt={service.title} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute bottom-2 left-2 font-mono text-[9px] text-white/50 bg-black/70 px-1.5 py-0.5">{service.tag}</div>
              </div>

              <div className="flex-1 flex flex-col justify-between pt-4 px-2 pb-2">
                <h2 className="text-xl font-bold uppercase tracking-tight">{service.title}</h2>
                <p className="text-neutral-500 text-[11px] font-mono line-clamp-2">{service.desc}</p>
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <button 
              onClick={() => setSelectedService(null)} 
              className="absolute top-4 right-4 z-50 font-mono text-lg text-neutral-400 bg-transparent hover:text-white hover:bg-black/50 w-16 h-16 flex items-center justify-center rounded-full uppercase transition-colors"
            >
              X
            </button>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            />
            <motion.div 
              layoutId={`service-${selectedService.id}`}
              className="relative bg-neutral-950 w-full max-w-4xl h-[70vh] flex flex-col md:flex-row overflow-hidden shadow-2xl p-2 z-10 text-white"
            >
              
              
              <div className="relative w-full md:w-[55%] h-[40vh] md:h-full bg-neutral-900">
                <Image src={selectedService.image} alt={selectedService.title} fill className="object-cover opacity-80" />
              </div>

              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between font-sans">
                <div className="space-y-6">
                  {/* <span className="font-mono text-xs text-white/40">INDEX_{selectedService.id}</span> */}
                  <h1 className="text-4xl font-bold uppercase">{selectedService.title}</h1>
                  <p className="text-neutral-400 text-sm leading-relaxed">{selectedService.desc}</p>
                </div>
                {/* <div className="font-mono text-[10px] text-neutral-500 animate-pulse">● CORE_STABLE</div> */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;