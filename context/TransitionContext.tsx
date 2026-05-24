"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import CameraTransition from "@/components/CameraTransition";

interface TransitionContextType {
  triggerTransition: (targetUrl: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = (targetUrl: string) => {
    setIsTransitioning(true);

    // Opsyonal: Tunog ng camera shutter click
    const audio = new Audio("/sounds/camera-shutter.mp3");
    audio.play().catch(() => {});

    // 1. Hintayin matapos ang pag-sara ng lens (0.6s)
    setTimeout(() => {
      router.push(targetUrl);

      // 2. Pagdating sa bagong page, dahan-dahang buksan ulit ang lens
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100); 
    }, 600);
  };

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {/* Naka-render ang shutter sa pinaka-itaas ng buong app */}
      <CameraTransition isActive={isTransitioning} />
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) throw new Error("useTransition must be used within TransitionProvider");
  return context;
}