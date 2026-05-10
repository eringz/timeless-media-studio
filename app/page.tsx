"use client";

import { useEffect, useRef, useState } from 'react';

const WordAnimation = ({ word }: { word: string }) => {
  const [displayWord, setDisplayWord] = useState(word);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => {
      setDisplayWord(word);
      setAnimate(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [word]);

  return (
    <span
      key={word}
      className={`text-blue-500 inline-block transition-all duration-500 ${
        animate ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {displayWord}
    </span>
  );
};

export default function Home() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [randomWord, setRandomWord] = useState('Moment');

  const words = ['Moment', 'Memory', 'Story', 'Dream', 'Magic', 'Light', 'Frame', 'Essence', 'Beauty', 'Art', 'Vision', 'Soul'];

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

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * words.length);
      setRandomWord(words[randomIndex]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
      <nav
        className={`nav-header fixed top-0 left-0 right-0 z-50 transform transition-transform duration-500 ease-in-out bg-black ${headerVisible ? 'translate-y-0' : '-translate-y-full'} flex flex-col sm:flex-row justify-between gap-2 p-4 sm:p-8 text-white w-full`}
      >
        <div className="text-2xl sm:text-4xl font-bold">Timeless Media Studio</div>
        <div 
          className="flex flex-wrap gap-2 sm:gap-20"
        >
          <button className="group relative overflow-hidden rounded-full border border-white px-3 sm:px-5 py-2 transition duration-300 active:scale-95 hover:bg-gray-700 text-xs sm:text-base">
            <span className="relative z-10">Home</span>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </button>
          <button className="group relative overflow-hidden rounded-full border border-white px-3 sm:px-5 py-2 transition duration-300 active:scale-95 hover:bg-gray-700 text-xs sm:text-base">
            <span className="relative z-10">About</span>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </button>
          <button className="group relative overflow-hidden rounded-full border border-white px-3 sm:px-5 py-2 transition duration-300 active:scale-95 hover:bg-gray-700 text-xs sm:text-base">
            <span className="relative z-10">Services</span>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </button>
          <button className="group relative overflow-hidden rounded-full border border-white px-3 sm:px-5 py-2 transition duration-300 active:scale-95 hover:bg-gray-700 text-xs sm:text-base">
            <span className="relative z-10">Gallery</span>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </button>
          <button className="group relative overflow-hidden rounded-full border border-white px-3 sm:px-5 py-2 transition duration-300 active:scale-95 hover:bg-gray-700 text-xs sm:text-base">
            <span className="relative z-10">Contact</span>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </button>
        </div>
      </nav>
      <div className="hero-section w-full bg-black text-white relative pt-20 sm:pt-0 min-h-screen flex items-center">
        <div
          className="flex flex-col gap-6 sm:gap-8 px-4 sm:px-24 py-8 sm:py-4 w-full sm:w-96"
        >
          <p className="text-3xl sm:text-6xl md:text-8xl font-bold leading-tight">
            Create Every <WordAnimation word={randomWord} />
          </p>
          <button
            className="px-6 sm:px-8 py-3 sm:py-4 w-40 sm:w-48 border border-white rounded-full hover:bg-white hover:text-black transition duration-300 text-sm sm:text-base"
          >
            Book Now
          </button>
        </div>
      </div>
      <div className="about flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8 p-4 sm:p-8 md:p-24 bg-white text-black w-full">
        <div className="w-full lg:w-1/2">
          <img 
            className="w-full h-auto rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
            src="/images/camera-shot.png"
            alt="camera shot image"
          />
        </div>
        <div className="flex flex-col gap-4 sm:gap-8 w-full lg:w-1/2">
          <h2 className="text-2xl sm:text-4xl font-bold">ABOUT US</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            We believe that every second holds a story worth keeping. What started as a simple passion for the lens has evolved into a dedicated mission: to freeze time for the moments that matter most.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            From the quiet, candid smiles to the grandest celebrations of life, our goal is to capture the raw emotion and beauty of your journey. We don't just take pictures; we preserve legacies, one frame at a time.
          </p>
        </div>
      </div>
      <div className="services flex flex-col items-center gap-6 sm:gap-8 p-4 sm:p-8 md:p-24 bg-gray-50 w-full">
        <h2 className="text-2xl sm:text-4xl font-bold">Services</h2>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
          <div className="rounded-3xl border border-gray-300 p-6 sm:p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 text-center">Photography</div>
          <div className="rounded-3xl border border-gray-300 p-6 sm:p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 text-center">Videography</div>
          <div className="rounded-3xl border border-gray-300 p-6 sm:p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 text-center">Event Coverage</div>
        </div>
      </div>
      <div className="gallery flex flex-col items-center gap-6 sm:gap-8 p-4 sm:p-8 md:p-24 bg-white text-black w-full text-center">
        <h2 className="text-2xl sm:text-4xl font-bold">Gallery</h2>
        <p className="text-sm sm:text-base">gallery ni ron ito ng matapos</p>
      </div>
      <footer className="p-4 sm:p-6 bg-gray-900 text-white text-center w-full text-xs sm:text-base">
        Copyright by Frontdesk Team 2026
      </footer>
    </div>
  );
}
 