"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from "framer-motion";
import QR from "@/sections/hero-section/QR";
import { words } from "@/config/content";

interface MagneticImageProps {
  src?: string;
  alt?: string;
  className?: string;
  mouseX: number;
  mouseY: number;
  strength?: number;
  id: string;
  label?: string;
}

const WordAnimation = ({ word }: { word: string }) => {
  return (
    <span className="relative inline-block h-[1.2em] align-bottom">
      <span className="invisible">{word}</span>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={word}
          initial={{ opacity: 0, filter: "blur(12px) brightness(200%)", scale: 0.98 }}
          animate={{ opacity: 1, filter: "blur(0px) brightness(100%)", scale: 1 }}
          exit={{ opacity: 0, filter: "blur(12px) brightness(200%)", scale: 1.02 }}
          transition={{ 
            duration: 2.0, 
            ease: [0.22, 0, 0.36, 1],
            scale: { type: "spring", stiffness: 100, damping: 10 } 
          }}
          className="text-[#A3A3A3] italic font-serif absolute top-0 left-0 "
          // className="text-[#A3A3A3] italic font-serif absolute top-0 left-0  gradient-right"
        >
          {word}
        </motion.div>
      </AnimatePresence>
    </span>
  );
};

const MagneticImage: React.FC<MagneticImageProps> = ({ src, alt, className, mouseX, mouseY, strength = 0.3, id, label = "CAM_FEED" }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const distortionScale = useMotionValue(0);

  const springX = useSpring(mX, { stiffness: 45, damping: 14 });
  const springY = useSpring(mY, { stiffness: 45, damping: 14 });
  const springDistort = useSpring(distortionScale, { stiffness: 60, damping: 15 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const pullLimit = 450;

    if (dist < pullLimit) {
      mX.set(dx * strength);
      mY.set(dy * strength);
      
      const force = (1 - dist / pullLimit) * 45 * Math.abs(strength);
      distortionScale.set(force);
    } else {
      mX.set(0);
      mY.set(0);
      distortionScale.set(0);
    }
  }, [mouseX, mouseY, strength, mX, mY, distortionScale]);

  const baseScale = useTransform(springDistort, [0, 45], [1, 1.08]);

  return (
    <div id="hero" className={`hero-section ${className}`}>
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={`liquid-glitch-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={springDistort.get()} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          </filter>
        </defs>
      </svg>

      <motion.div
        ref={ref}
        style={{
          x: springX,
          y: springY,
          scale: baseScale,
          filter: `url(#liquid-glitch-${id})`,
        }}
        className="w-full h-full cursor-pointer overflow-hidden bg-neutral-900 border border-white/10 relative p-2 group"
      >
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40 z-20 group-hover:border-white transition-colors" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40 z-20 group-hover:border-white transition-colors" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40 z-20 group-hover:border-white transition-colors" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40 z-20 group-hover:border-white transition-colors" />
        
        {/* Tech Label Overlay */}
        <div className="absolute bottom-3 left-3 z-20 font-mono text-[9px] tracking-widest text-white/40 bg-black/60 px-1.5 py-0.5 rounded-sm backdrop-blur-xs border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
          [{label}]
        </div>

        <div className="w-full h-full overflow-hidden relative">
          <motion.img 
            src={src} 
            alt={alt}
            style={{
              scale: 1.15,
              x: useTransform(springX, (v) => Number(v) * -0.15),
              y: useTransform(springY, (v) => Number(v) * -0.15),
            }}
            className="w-full h-full object-cover filter grayscale contrast-[1.1] brightness-90 opacity-70 group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 ease-out pointer-events-none"
          />
        </div>
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  const [randomWord, setRandomWord] = useState(words[0]);
  const [isQROpen, setIsQROpen] = useState(false);
  const [rawMousePosition, setRawMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsQROpen(false);
      }
    };

    if (isQROpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isQROpen]); 

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setRawMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomWord((prev) => {
        const remainingWords = words.filter(w => w !== prev);
        return remainingWords[Math.floor(Math.random() * remainingWords.length)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-section w-full bg-black text-white relative min-h-screen flex items-center overflow-hidden selection:bg-white selection:text-black">
      
      {/* ================= BACKGROUND ENVIRONMENT ================= */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/images/lens-bg.jpg')] bg-cover bg-center opacity-[0.12] pointer-events-none mix-blend-screen filter scale-105" 
      />
      
      {/* Subtle Digital Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* FIXED HUD SYSTEM TECH LABELS */}
      <div className="absolute top-8 left-8 z-30 text-[10px] tracking-[0.3em] font-mono text-white/30 hidden sm:block">
        SYS.LOC: //PORTAL_ACTIVE
      </div>
      <div className="absolute top-8 right-8 z-30 text-[10px] tracking-[0.3em] font-mono text-white/30 hidden sm:block">
        CAM_INDEX_01 // 2026_V1.0
      </div>

      {/* ================= GRID-ALIGNED BENTO COMPOSITION ================= */}
      {/* Ginawa nating grid-ready container para hawakan ang visual elements sa kanan nang maayos */}
      <div className="hidden lg:block absolute inset-y-0 right-[6%] w-[45%] z-10 pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* Main Editorial Hero Shot (Ang Nakaangla sa Itaas) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-[5%] top-[12%] w-[380px] h-[840px] z-20 pointer-events-none"
          >
            <MagneticImage 
              id="img-hero-1" 
              src="/images/portrait-1.jpg" 
              alt="Editorial Shot 1" 
              label="Alodia Gosengfiao"
              className="w-full h-full shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)]" 
              mouseX={rawMousePosition.x} 
              mouseY={rawMousePosition.y} 
              strength={0.3} 
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-[0%] bottom-[16%] w-[380px] h-[540px] z-30 pointer-events-none"
          >
            <MagneticImage 
              id="img-hero-2" 
              src="/images/portrait-2.jpg" 
              alt="Editorial Shot 2" 
              label="Ji-Chang Wook"
              className="w-full h-full shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)]" 
              mouseX={rawMousePosition.x} 
              mouseY={rawMousePosition.y} 
              strength={-0.4} 
            />
          </motion.div>
          
  

            {/* <MagneticImage 
              id="img-hero-2" 
              src="/images/portrait-3.jpg" 
              alt="Editorial Shot 2" 
              label="DATA_SCAN_02"
              className="absolute left-[0%] bottom-[16%] w-[380px] h-[540px] shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)] z-30" 
              mouseX={rawMousePosition.x} 
              mouseY={rawMousePosition.y} 
              strength={-0.4} 
            /> */}

          {/* Micro Target Data Box Tracker (Nagpapatibay ng Core Interface Theme) */}
          {/* <motion.div 
            style={{
              x: useSpring(useMotionValue(0), { stiffness: 50, damping: 20 }),
              y: useSpring(useMotionValue(0), { stiffness: 50, damping: 20 })
            }}
            className="absolute right-[15%] bottom-[10%] w-[140px] h-[100px] border border-white/5 bg-neutral-950/40 backdrop-blur-xs p-3 font-mono text-[9px] text-white/20 flex flex-col justify-between z-10"
          >
            <div className="flex justify-between items-start border-b border-white/5 pb-1">
              <span>BUFF_SZ:</span>
              <span className="text-white/40">1080P</span>
            </div>
            <div className="space-y-0.5">
              <div>ISO // AUTO</div>
              <div className="text-white/40 animate-pulse">● REC_LIVE</div>
            </div>
          </motion.div> */}
        </div>
      </div>
          

      {/* ================= MAIN CONTENT TEXT WRAPPER ================= */}
      <div className="flex flex-col gap-10 ml-0 px-6 sm:px-12 lg:px-24 w-full max-w-7xl mx-auto relative z-20">
        
        <div className="text-6xl sm:text-7xl lg:text-[8.5rem] xl:text-[9.5rem] font-bold leading-[1.02] tracking-tight dm-serif">
          <motion.div 
            initial={{ opacity: 0, y: 35 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="gradient-left"
          >
            Create
          </motion.div> 
          
          <motion.div 
            initial={{ opacity: 0, y: 35 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }} 
            className="font-light text-neutral-400 italic gradient-right"
          >
            Every
          </motion.div> 
          
          <WordAnimation word={randomWord} />
          
        </div>

        {/* INTERACTION CONTROLS / BUTTONS */}
        <div className="flex flex-wrap gap-4 sm:gap-6 items-center mt-2">
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            onClick={() => router.push('/contact')}
            className="px-8 py-4 w-48 bg-white text-black hover:bg-neutral-200 transition-all duration-400 text-sm font-bold tracking-widest uppercase rounded-none shadow-xl shadow-black/80 active:scale-95"
          >
            Book Now
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            onClick={() => setIsQROpen(true)}
            className="px-8 py-4 w-48 border border-white/10 text-white hover:border-white/40 hover:bg-white/5 transition-all duration-400 text-sm font-semibold tracking-widest uppercase rounded-none backdrop-blur-xs"
          >
            Scan Share
          </motion.button>
        </div>
      </div>

      {/* BOTTOM RADIAL TRANSITION FADE */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#fbfaf7] via-[#fbfaf7]/10 to-transparent pointer-events-none z-40" />

      {/* MODAL POP-UP BOX OVERLAY FOR QR CODE */}
      <AnimatePresence>
        {isQROpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsQROpen(false)} 
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.96 }} 
              className="relative bg-neutral-950  border border-white/10 p-8 rounded-none max-w-md w-full shadow-2xl flex flex-col items-center text-center z-10"
            >
              <h3 className="text-2xl font-serif mb-2 text-white tracking-wide">Scan to Share</h3>
              <p className="text-xs text-neutral-400 mb-6 tracking-wider">Instantly access our digital space on your phone.</p>
              
              <div className="bg-white p-4 rounded-none shadow-inner">
                <QR />
              </div>
              
              <button 
                onClick={() => setIsQROpen(false)} 
                className="mt-6 text-xs tracking-[0.2em] text-neutral-500 hover:text-white uppercase transition-colors"
              >
                [ Close Window ]
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroSection;