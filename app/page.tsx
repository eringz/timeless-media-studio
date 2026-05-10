// import Image from "next/image";
//Figma design link:
//https://www.figma.com/design/AiaWsLW8HXtAqFI3avd4IY/Untitled?node-id=0-1&t=YlV3cvA6KUF7SZtj-1

"use client";

export default function Home() {
  return (
    <div className="flex flex-col w-screen">
      <nav
        className="nav-header  flex justify-between gap-2 p-8 bg-black w-screen text-white"
      >
        <div className="text-4xl">Timeless Media Studio</div>
        <div 
          className="flex gap-20"
        >
          <button className="group relative overflow-hidden rounded-full border border-white px-5 py-2 transition duration-300 active:scale-95 hover:animate-spin hover:bg-gray-700">
            <span className="relative z-10">Home</span>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </button>
          <button className="group relative overflow-hidden rounded-full border border-white px-5 py-2 transition duration-300 active:scale-95 hover:animate-spin hover:bg-gray-700">
            <span className="relative z-10">About</span>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </button>
          <button className="group relative overflow-hidden rounded-full border border-white px-5 py-2 transition duration-300 active:scale-95 hover:animate-spin hover:bg-gray-700">
            <span className="relative z-10">Services</span>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </button>
          <button className="group relative overflow-hidden rounded-full border border-white px-5 py-2 transition duration-300 active:scale-95 hover:animate-spin hover:bg-gray-700">
            <span className="relative z-10">Gallery</span>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </button>
          <button className="group relative overflow-hidden rounded-full border border-white px-5 py-2 transition duration-300 active:scale-95 hover:animate-spin hover:bg-gray-700">
            <span className="relative z-10">Contact</span>
            <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
          </button>
        </div>
      </nav>
      <div className="hero-section w-screen bg-black text-white relative">
        <div
          className="flex flex-col gap-8 p-24 max-w-6xl mx-auto"
        >
          <p className="text-6xl md:text-8xl font-bold">
            Create Every Moment
          </p>
          <button
            className="px-8 py-4 w-48 border border-white rounded-full hover:bg-white hover:text-black transition duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
      <div className="about flex flex-col lg:flex-row justify-between items-center gap-8 p-24 bg-white text-black">
        <div className="w-full lg:w-1/2">
          <img 
            className="w-full h-auto rounded-xl shadow-lg"
            src="/images/camera-shot.png"
            alt="Camera shot"
          />
        </div>
        <div className="flex flex-col gap-8 w-full lg:w-1/2">
          <h2 className="text-4xl font-bold">ABOUT US</h2>
          <p>
            We believe that every second holds a story worth keeping. What started as a simple passion for the lens has evolved into a dedicated mission: to freeze time for the moments that matter most.
          </p>
          <p>
            From the quiet, candid smiles to the grandest celebrations of life, our goal is to capture the raw emotion and beauty of your journey. We don't just take pictures; we preserve legacies, one frame at a time.
          </p>
        </div>
      </div>
      <div className="services flex flex-col items-center gap-8 p-24 bg-gray-100 text-black">
        <h2 className="text-4xl font-bold">Services</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
          <div className="rounded-3xl border border-gray-300 p-8 bg-white shadow-sm">Photography</div>
          <div className="rounded-3xl border border-gray-300 p-8 bg-white shadow-sm">Videography</div>
          <div className="rounded-3xl border border-gray-300 p-8 bg-white shadow-sm">Event Coverage</div>
        </div>
      </div>
      <div className="gallery flex flex-col items-center gap-6 p-24 bg-white text-black">
        <h2 className="text-4xl font-bold">Gallery</h2>
        <p>gallery ni ron ito</p>
      </div>
      <div className="contact flex flex-col items-center gap-4 p-24 bg-black text-white">
        <h2 className="text-4xl font-bold">Contact</h2>
        <p>Contact us</p>
      </div>
      <footer className="p-6 bg-gray-900 text-white text-center">
        Copyright by Frontdesk Team 2026
      </footer>
    </div>
  );
}
 