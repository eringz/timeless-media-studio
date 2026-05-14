"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import EventService from "@/components/ui/EventService";



const Services = () => {
    return (
        <div
            id="services"
            className="services flex flex-col gap-6 sm:gap-8 p-4 sm:p-8 md:p-24 bg-gray-50 w-full h-full"
        >
            <SectionHeading title="Services" />

            <div className="flex flex-col gap-12 lg:px-48 w-full h-full overflow-x-auto">
                <div className="flex flex-col lg:flex-row gap-12">
                    <EventService name="family" event="VIDEOGRAPHY" />
                    <EventService name="couple" event="PHOTOGRAPHY" />
                    <EventService name="corporate" event="EVENT COVERAGE" />
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <EventService name="family" event="PORTRAIT" />
                    <EventService
                        name="couple"
                        event="PRE-WEDDING AND ENGAGEMENT SHOOT"
                    />
                    <EventService name="corporate" event="EDITING" />
                </div>
            </div>


            {/* Marquee Text */}
            <div className="w-full overflow-hidden bg-gray py-4 rounded">
                <div className="marquee flex whitespace-nowrap">
                    <span className="text-white text-lg font-semibold px-8">
                         Photography •  Birthday Events •  Weddings •  Debuts •  Concerts •  Family Shoot •  Prenup •  Travel Photography •
                    </span>

                    <span className="text-white text-lg font-semibold px-8">
                         Photography •  Birthday Events •  Weddings •  Debuts •  Concerts •  Family Shoot •  Prenup •  Travel Photography •
                    </span>
                </div>
            </div>

            

            {/* Animation */}
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
            `}</style>
        </div>
    );
};

export default Services;
