"use client";

import { ReactNode } from "react";
import { useTransition } from "@/context/TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const { triggerTransition } = useTransition();

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault(); // Pigilan ang default browser navigation
        triggerTransition(href); // Patakbuhin ang shutter bago lumipat
      }}
    >
      {children}
    </a>
  );
}

