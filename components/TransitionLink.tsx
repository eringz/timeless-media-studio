"use client";

import { MouseEvent, ReactNode } from "react";
import { useTransition } from "@/context/TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export default function TransitionLink({ href, children, className, onClick }: TransitionLinkProps) {
  const { triggerTransition } = useTransition();

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault(); // Pigilan ang default browser navigation
        onClick?.(e);
        triggerTransition(href); // Patakbuhin ang shutter bago lumipat
        e.preventDefault(); 
        onClick?.(e);
        triggerTransition(href); 
      }}
    >
      {children}
    </a>
  );
}

