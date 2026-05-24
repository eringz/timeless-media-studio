"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export default function FadeIn({ children, delay = 0, direction = "up" }: FadeInProps) {
  const directions = {
    up: { y: 40, x: 0 }, 
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}

      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}

      viewport={{ once: true, margin: "-100px" }} 
      exit={{ 
        opacity: 0, 
        y: direction === "up" ? -10 : direction === "down" ? 10 : 0,
        x: direction === "left" ? -10 : direction === "right" ? 10 : 0,
        transition: { duration: 0.2 }
      }}
      transition={{
        duration: 0.7, 
        ease: [0.215, 0.610, 0.355, 1],
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
}