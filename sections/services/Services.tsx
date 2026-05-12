import SectionHeading from "@/components/ui/SectionHeading";

const Services = () => {
    return (
        <div id="services" className="services flex flex-col items-center gap-6 sm:gap-8 p-4 sm:p-8 md:p-24 bg-gray-50 w-full relative">
            <SectionHeading title="Services" />

            {/* Full-width Marquee Scrolling Text */}
            <div className="absolute left-0 right-0 w-screen overflow-hidden bg-black text-white py-4 -mx-4 sm:-mx-8 md:-mx-24">
                <div className="animate-marquee whitespace-nowrap">
                    <span className="text-lg sm:text-xl font-medium mr-8">
                        photography • event coverage • portrait • wedding photography • corporate events • family portraits • graduation ceremonies • birthday celebrations • product photography • real estate photography • fashion shoots • documentary photography • event coverage • portrait sessions • photography services •
                    </span>
                    <span className="text-lg sm:text-xl font-medium mr-8">
                        photography • event coverage • portrait • wedding photography • corporate events • family portraits • graduation ceremonies • birthday celebrations • product photography • real estate photography • fashion shoots • documentary photography • event coverage • portrait sessions • photography services •
                    </span>
                </div>
            </div>

            {/* Spacer to account for absolute positioned marquee */}
            <div className="py-4"></div>
        </div>
    );
}

export default Services;