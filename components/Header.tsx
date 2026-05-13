"use client";

import { useState, useEffect, useRef } from "react";

import Link from "next/link";

const Header = () => {
    const [headerVisible, setHeaderVisible] = useState(true);    
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setHeaderVisible(false);
          } else {
            setHeaderVisible(true);
          }
          lastScrollY.current = currentScrollY;
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <nav
                className={`nav-header fixed top-0 left-0 right-0 z-50 transform transition-transform duration-500 ease-in-out bg-black ${headerVisible ? 'translate-y-0' : '-translate-y-full'} flex flex-col sm:flex-row justify-between gap-2 p-4 sm:p-8 text-white w-full`}
            >
                <div className="text-2xl sm:text-4xl font-bold">Timeless Media Studio</div>
                <div 
                    className="flex flex-wrap gap-1 sm:gap-2"
            >
                <Link
                    href="/"
                    className="group relative overflow-hidden rounded-full border border-white px-2 sm:px-3 py-1 transition duration-300 active:scale-95 hover:bg-gray-700 text-xs sm:text-sm"
                >
                    <span className="relative z-10">Home</span>
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                </Link>
                <Link
                    href="#about" 
                    className="group relative overflow-hidden rounded-full border border-white px-2 sm:px-3 py-1 transition duration-300 active:scale-95 hover:bg-gray-700 text-xs sm:text-sm"
                >
                    <span className="relative z-10">About</span>
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                </Link>
                <Link
                    href="#gallery"
                    className="group relative overflow-hidden rounded-full border border-white px-2 sm:px-3 py-1 transition duration-300 active:scale-95 hover:bg-gray-700 text-xs sm:text-sm"
                >
                    <span className="relative z-10">Gallery</span>
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                </Link>
                <Link
                    href="/track"
                    className="group relative overflow-hidden rounded-full border border-white px-2 sm:px-3 py-1 transition duration-300 active:scale-95 hover:bg-gray-700 text-xs sm:text-sm"
                >
                    <span className="relative z-10">Tracking Order</span>
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                </Link>
        </div>
      </nav>
        </div>
    );  
}

export default Header;