"use client";
import SectionHeading from "@/components/ui/SectionHeading";

const Gallery = () => {
    return (
        <div className="gallery flex flex-col justify-center mt-8">
            <SectionHeading title="Services" >Services</SectionHeading>
            <div className="gallery flex flex-row justify gap-8 px-48 py-8">
                {/** First Column */}
                <div className="w-1/3 flex flex-col gap-y-8">
                    <div
                        className="h-[700px] bg-[url(/images/gallery/wedding.png)] bg-no-repeat bg-cover bg-center rounded-lg shadow-xl"
                    >
                    </div>
                    <div
                        className="h-[800px] bg-blue-800 bg-[url(/images/gallery/cat.png)] bg-no-repeat bg-cover rounded-lg shadow-xl"
                    >
                    </div>
                </div>
                {/** Second Column */}
                <div className="flex flex-col gap-8 w-1/3">
                    <div
                        className="h-[460px] bg-[url(/images/gallery/concert.png)] bg-no-repeat bg-cover bg-center rounded-lg shadow-xl"
                    />
                    <div 
                        className="h-[460px] bg-[url(/images/gallery/party.png)] bg-no-repeat bg-cover bg-center rounded-lg shadow-xl" 
                    />
                    <div 
                        className="h-[460px] bg-[url(/images/gallery/woman.png)] bg-no-repeat bg-cover bg-center rounded-lg shadow-xl" 
                    />
                </div>
                <div className="flex flex-col gap-8 w-1/3">
                    <div className="h-[860px] bg-[url(/images/gallery/man.png)] bg-no-repeat bg-cover bg-center rounded-lg shadow-xl" />
                    <div className="h-[600px] bg-[url(/images/gallery/couple-golf.png)] bg-no-repeat bg-cover bg-center rounded-lg shadow-xl" />
                </div>
            </div>
        </div>
    );
}

export default Gallery;