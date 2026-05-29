"use client";
import Link from "next/link";
import TimelessLogo from "@/components/ui/TimelessLogo";
import TransitionLink from "@/components/TransitionLink";

interface MobileNavProps {
  navLinks: { 
    name: string;
    href: string;
  }[];
  visibility: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
}

const MobileNav = ({
    navLinks,
    visibility,
    menuOpen,
    onToggleMenu,
    onCloseMenu,
}: MobileNavProps) => {
  
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 text-white transition-transform duration-500 ease-in-out ${
        visibility ? "translate-y-0" : "-translate-y-full"
      } bg-black/60 backdrop-blur-md border-b border-white/5`}
    >
        <div className="flex items-center justify-between px-6 py-4">
            <TimelessLogo onClick={onCloseMenu} />

            {/** Hamburger Button - Iningatan ang functionality */}
            <button
                title="hamburger"
                onClick={onToggleMenu}
                className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-sm border border-white/20 bg-white/5 shadow-lg shadow-gray-900"
            >
                <span
                    className={`h-0.5 w-6 bg-white transition-all duration-300 ${
                    menuOpen ? "translate-y-1.5 rotate-45" : ""
                    }`}
                />
                <span
                    className={`h-0.5 w-6 bg-white transition-all duration-300 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                    }`}
                />
                <span
                    className={`h-0.5 w-6 bg-white transition-all duration-300 ${
                    menuOpen ? "-translate-y-1.5 -rotate-45" : "" 
                    }`}
                />
            </button>
        </div>

        {/** Dialog Box - Binalik ang orihinal mong layout flow pero mas swabe ang transit */}
        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out bg-black/95 ${ 
              menuOpen ? "max-h-[500px] opacity-100 border-b border-white/10" : "max-h-0 opacity-0" 
            }`}
        >
            <div className="flex flex-col items-end gap-3 px-6 pb-6 pt-2">
                {navLinks.map((link) => (
                    <TransitionLink
                        key={link.name}
                        href={link.href}
                        onClick={onCloseMenu}
                        // Binalik ang text-lg, dm-serif, at text-shadow classes mo
                        className="dm-serif w-full rounded px-4 py-2 text-center text-lg tracking-widest text-shadow-md text-shadow-sky-300/40 hover:bg-white hover:text-black transition duration-300 active:scale-95 sm:w-60 shadow-sm shadow-gray-500/50"
                    >
                        {link.name}
                    </TransitionLink>
                ))}
            </div>
        </div>    
    </nav>
  );
};

export default MobileNav;