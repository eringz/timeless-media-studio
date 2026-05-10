// import Image from "next/image";
//Figma design link:
//https://www.figma.com/design/AiaWsLW8HXtAqFI3avd4IY/Untitled?node-id=0-1&t=YlV3cvA6KUF7SZtj-1

"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

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
      <Swiper
        modules={[EffectCards]}
        effect="cards"
        grabCursor={true}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="hero-section w-screen">
            <div
              className="flex flex-col gap-8 absolute left-24 p-4 w-128 h-fit text-white"
            >
              <p className="text-9xl">
                Create Every Moment
              </p>
              <button
                className="group relative overflow-hidden px-8 py-4 w-48 border border-white rounded-full transition duration-300 active:scale-95 hover:animate-spin hover:bg-gray-700"
              >
                <span className="relative z-10">Book Now</span>
                <span className="absolute inset-x-0 bottom-0 h-1 bg-white scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
              </button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="about flex justify-between items-center gap-2 p-24 h-fit bg-white group">
            <div className="w-1/2">
              <img 
                className="transition duration-300 group-hover:scale-110"
                src="/images/camera-shot.png"
              />
            </div>
            <div className="flex flex-col items-center gap-8 w-1/2">
              <h2 className="text-4xl font-bold">ABOUT US</h2>
              <p>
                We believe that every second holds a story worth keeping. What started as a simple passion for the lens has evolved into a dedicated mission: to freeze time for the moments that matter most.
              </p>
              <p>
                From the quiet, candid smiles to the grandest celebrations of life, our goal is to capture the raw emotion and beauty of your journey. We don't just take pictures; we preserve legacies, one frame at a time.
              </p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="services flex flex-col items-center h-120 ">
            <h2 className="text-4xl font-bold">Services</h2>
            <div className="cards ">
              <div>Harry - Update 2</div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="gallery">
            gallery ni ron ito
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="contact">Contact us</div>
        </SwiperSlide>
      </Swiper>
      <footer>
        Copyright by Frontdesk Team 2026
      </footer>
    </div>
  );
}
 