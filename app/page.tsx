// import Image from "next/image";
"use client";

export default function Home() {
  return (
    <div className="flex flex-col bg-black w-screen">
      <nav
        className="nav-header p-8 flex justify-between gap-2 w-screen text-white"
      >
        <div className="text-4xl">Timeless Media Studio</div>
        <div 
          className="flex gap-20"
        >
          <a>Home</a>
          <a>About</a>
          <a>Services</a>
          <a>Gallery</a>
          <a>Contact</a>
        </div>
      </nav>
      <div className="hero-section w-screen">
        <div
          className="flex flex-col gap-8 absolute left-24 p-4 w-128 h-fit text-white"
        >
          <p className="text-9xl">
            Create Every Moment
          </p>
          <button
            className="px-8 py-4 w-48 border border-white rounded-lg"
          >
            Book Now
          </button>
        </div>
      </div>
      <div className="about h-240 bg-red-100">

      </div>
    </div>
  );
}
 