"use client";
import Link from "next/link";
import TimelessLogo from "@/components/ui/TimelessLogo";
import TransitionLink from "@/components/TransitionLink";
import { usePathname } from "next/navigation";
import { useState, useEffect} from "react";

interface DesktopNavProps {
  navLinks: {
    name: string;
    href: string;
  }[];
  visibility: boolean;
}

const DesktopNav = ({ navLinks, visibility }: DesktopNavProps) => {
  const pathname = usePathname();
  console.log(pathname);
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    // Set the initial hash on mount
    setCurrentHash(window.location.hash);

    // Listen for hash changes (e.g., clicking back/forward or navigation)
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]); // Re-run if pathname changes

  const isActive = (href: string) => {
    // If the link is just a path (like '/contact')
    if (!href.includes("#")) {
      return pathname === href && currentHash === "";
    }
    
    // If the link contains a hash (like '/#gallery')
    const [linkPath, linkHash] = href.split("#");
    return pathname === linkPath && currentHash === `#${linkHash}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 text-white transition-transform duration-500 ease-in-out ${
        visibility ? "translate-y-0" : "-translate-y-full"
      } bg-black/50 backdrop-blur-md border-b border-white/5`} 
    >
      <div className="flex items-center justify-between px-6 sm:px-12 w-full">
        <TimelessLogo />

        <div className="flex items-center gap-4 sm:gap-6">
          {navLinks.map((link) => (
            <TransitionLink
              key={link.name}
              href={link.href}
              onClick={() => {
                if (link.href.includes("#")) {
                  setCurrentHash(`#${link.href.split("#")[1]}`);
                } else {
                  setCurrentHash("");
                }
              }}
              className={`${isActive(link.href)  ? "text-white/40" : ""} dm-serif  px-4 sm:px-6 rounded text-xl lg:text-2xl whitespace-nowrap text-shadow-md text-shadow-sky-900/90 tracking-widest hover:text-white/60 transition-colors duration-500`}
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