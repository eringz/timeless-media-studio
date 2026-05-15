"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import EventService from "@/components/ui/EventService";



const Services = () => {
    return (
        <div
            id="services"
            className="services flex flex-col lg:gap-6  p-4 sm:p-8 md:p-24 bg-gray-50 w-full h-full"
        >
            <SectionHeading title="SERVICES" />

            <div className="flex flex-col gap-8 lg:gap-12 lg:px-48 w-full h-full overflow-x-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <EventService name="family" event="VIDEOGRAPHY" />
                    <EventService name="couple" event="PHOTOGRAPHY" />
                    <EventService name="corporate" event="EVENT COVERAGE" />
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <EventService name="family" event="PORTRAIT" />
                    <EventService
                        name="couple"
                        event="PRE-WEDDING AND ENGAGEMENT SHOOT"
                    />
                    <EventService name="corporate" event="EDITING" />
                </div>
            </div>
        </div>
    );
};

export default Services;