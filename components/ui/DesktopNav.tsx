"use client";
import Link from "next/link";
import TimelessLogo from "@/components/ui/TimelessLogo";
import TransitionLink from "@/components/TransitionLink";

interface DesktopNavProps {
  navLinks: {
    name: string;
    href: string;
  }[];
  visibility: boolean;
}

const DesktopNav = ({ navLinks, visibility }: DesktopNavProps) => {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 text-white transition-transform duration-500 ease-in-out ${
        visibility ? "translate-y-0" : "-translate-y-full"
      } bg-black/50 backdrop-blur-md border-b border-white/5`} 
    >
      <div className="flex items-center justify-between px-6 py-4 sm:px-12 w-full">
        <TimelessLogo />

        <div className="flex items-center gap-4 sm:gap-6">
          {navLinks.map((link) => (
            <TransitionLink
              key={link.name}
              href={link.href}
              className="dm-serif px-4 py-2 sm:px-6 rounded text-xl lg:text-2xl whitespace-nowrap text-shadow-md text-shadow-sky-300/40 tracking-widest hover:text-white/60 transition-colors duration-500"
            >
              {link.name}
            </TransitionLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;