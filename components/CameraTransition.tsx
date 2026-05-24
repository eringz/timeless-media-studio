"use client";

import { motion } from "framer-motion";

interface CameraTransitionProps {
  isActive: boolean;
}

export default function CameraTransition({ isActive }: CameraTransitionProps) {
  return (
    <>
      {/* 1. Ang Overlay para sa Flash at Negative Effect */}
      <motion.div
        className="fixed inset-0 z-[9999] pointer-events-none"
        initial={{ opacity: 0, backgroundColor: "#ffffff" }}
        animate={
          isActive
            ? { 
                opacity: [0, 1, 0.9, 0], // Biglang flash ng puti, magiging madilim saglit, sabay lalaho
                backgroundColor: ["#ffffff", "#ffffff", "#0a0a0a", "#0a0a0a"],
                backdropFilter: ["blur(0px)", "blur(0px)", "blur(20px)", "blur(0px)"]
              }
            : { opacity: 0 }
        }
        transition={{
          duration: 2.2,
          ease: "linear",
        }}
      />

      {/* 2. Isang mabilis na red "Recording" dot o focus square sa gitna habang nagpapakita ng flash (Opsyonal) */}
      {isActive && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 border border-white/20 relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          </div>
        </div>
      )}
    </>
  );
}