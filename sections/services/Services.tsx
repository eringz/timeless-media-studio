"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import EventService from "@/components/ui/EventService";

const services = [
  { name: "family", event: "VIDEOGRAPHY" },
  { name: "couple", event: "PHOTOGRAPHY" },
  { name: "corporate", event: "EVENT COVERAGE" },
  { name: "family", event: "PORTRAIT" },
  { name: "couple", event: "PRE-WEDDING AND ENGAGEMENT SHOOT" },
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
            <div className="transition-all duration-500 group-hover:brightness-75">
              <EventService name={service.name} event={service.event} />
            </div>

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <h3 className="text-white text-xl sm:text-2xl font-bold tracking-wide text-center px-4">
                {service.event}
              </h3>
            </div>
          </button>
        ))}
      </div>

      {selectedService && (
        <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl p-4 sm:p-6 max-w-3xl w-full animate-zoomIn shadow-2xl">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute -top-4 -right-4 bg-white text-black w-10 h-10 rounded-full font-bold shadow-lg hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              ✕
            </button>

            <div className="scale-100 rounded-xl overflow-hidden">
              <EventService
                name={selectedService.name}
                event={selectedService.event}
              />
            </div>

            <h2 className="mt-5 text-center text-2xl sm:text-4xl font-extrabold text-black bg-yellow-300 px-4 py-3 rounded-xl">
              {selectedService.event}
            </h2>
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

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.75);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-zoomIn {
          animation: zoomIn 0.35s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Services;
