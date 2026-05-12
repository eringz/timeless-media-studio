"use client"
import SectionHeading from "@/components/ui/SectionHeading";
import EventService from "@/components/ui/EventService";


const Services = () => {
    return (
        <div id="services" className="services flex flex-col items-center gap-6 sm:gap-8 p-4 sm:p-8 md:p-24 bg-gray-50 w-full">
            <SectionHeading title="Services" />
            <div
                className="flex flex-col gap-12 px-48 w-full "
            >
                <div
                    className="flex gap-12"
                >   
                    <EventService name="family" event="VIDEOGRAPHY" />
                    <EventService name="couple" event="PHOTOGRAPHY" />
                    <EventService name="corporate" event="EVENT COVERAGE" />
                </div>

                <div
                    className="flex gap-12"
                >   
                    <EventService name="family" event="PORTRAIT" />
                    <EventService name="couple" event="PRE-WEDDING AND ENGAGEMENT SHOOT" />
                    <EventService name="corporate" event="EDITING"/>
                </div>
            </div>
        </div>
    );
}

export default Services;