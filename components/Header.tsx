"use client";

import MobileNav from "@/components/ui/MobileNav";
import DesktopNav from "@/components/ui/DesktopNav";
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility";



const navLinks = [
  // { name: "Home", href: "/" },
  { name: "ABOUT", href: "/#about" },
  { name: "SERVICES", href: "/#services" },
  { name: "GALLERY", href: "/#gallery" },
  { name: "RESERVED", href: "/contact" },
]

const Header = () => {
  const { headerVisibility, menuOpen, toggleMenu, closeMenu } = useHeaderVisibility();
  return (
    <>
      <div className="flex lg:hidden">
        <MobileNav 
          navLinks={navLinks}
          visibility={headerVisibility}
          menuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          onCloseMenu={closeMenu}
        />
      </div>
      <div className="hidden lg:flex">
        <DesktopNav 
          navLinks={navLinks}
          visibility={headerVisibility}
        />
      </div>
    </>
  );
};

export default Header;


