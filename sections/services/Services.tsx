"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import EventService from "@/components/ui/EventService";

const services = [
  { name: "family", event: "VIDEOGRAPHY" },
  { name: "couple", event: "PHOTOGRAPHY" },
  { name: "corporate", event: "EVENT COVERAGE" },
  { name: "camera-shot", event: "PORTRAIT" },
  { name: "camera", event: "PRE-WEDDING AND ENGAGEMENT SHOOT" },
  { name: "corporate", event: "EDITING" },
];

const Services = () => {
  const [selectedService, setSelectedService] = useState<{
    name: string;
    event: string;
  } | null>(null);

  return (
    <div
      id="services"
      className="services flex flex-col gap-6 sm:gap-8 p-4 sm:p-8 md:p-24 bg-gray-50 w-full h-full"
    >
      <SectionHeading title="Services" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:px-48 w-full h-full">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => setSelectedService(service)}
            className="group relative w-full text-left rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            <div className="transition-all duration-500 group-hover:scale-110 group-hover:brightness-75">
              <EventService name={service.name} event={service.event} />
            </div>

            {/* Hover overlay only, no extra text to avoid double text */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </button>
        ))}
      </div>

      {selectedService && (
        <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedService(null)}
            className="absolute top-5 right-5 z-[1000] bg-white text-black w-11 h-11 rounded-full font-bold shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300"
          >
            ✕
          </button>

          <div className="relative w-full h-full max-w-6xl flex flex-col items-center justify-center animate-fullZoom">
            <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl scale-100">
              <EventService
                name={selectedService.name}
                event={selectedService.event}
              />
            </div>
          </div>
        </div>
      )}

      {/* Marquee Text */}
      <div className="w-full overflow-hidden bg-black py-4 rounded">
        <div className="marquee flex whitespace-nowrap">
          <span className="text-white text-lg font-semibold px-8">
            Photography • Birthday Events • Weddings • Debuts • Concerts •
            Family Shoot • Prenup • Travel Photography •
          </span>

          <span className="text-white text-lg font-semibold px-8">
            Photography • Birthday Events • Weddings • Debuts • Concerts •
            Family Shoot • Prenup • Travel Photography •
          </span>
        </div>
      </div>

      <style jsx>{`
        .marquee {
          width: max-content;
          animation: marquee 18s linear infinite;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @keyframes fullZoom {
          from {
            opacity: 0;
            transform: scale(0.45);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fullZoom {
          animation: fullZoom 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Services;
