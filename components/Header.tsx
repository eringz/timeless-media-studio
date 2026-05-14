"use client";

import MobileNav from "@/components/ui/MobileNav";
import DesktopNav from "@/components/ui/DesktopNav";

const Header = () => {
 
  return (
    <>
      <div className="flex lg:hidden">
        <MobileNav />
      </div>
      <div className="hidden lg:flex">
        <DesktopNav />
      </div>
    </>
  );
};

export default Header;


