"use client";
import { useState, useEffect } from "react";

import SectionHeading from "@/components/ui/SectionHeading";




const Gallery = () => {
    const galleryPhotos = [
        "bg-[url('/images/gallery/wedding.png')]",
        "bg-[url('/images/gallery/cat.png')]",
        "bg-[url('/images/gallery/concert.png')]",
        "bg-[url('/images/gallery/party.png')]",
        "bg-[url('/images/gallery/woman.png')]",
        "bg-[url('/images/gallery/man.png')]",
        "bg-[url('/images/gallery/couple-golf.png')]",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => prevIndex === galleryPhotos.length - 1 ?  0 : prevIndex + 1 );
        }, 3000);


        return () => clearInterval(interval);
    }, [galleryPhotos.length])
    return (
        <div className="gallery flex flex-col justify-center mt-8">
            <SectionHeading title="Gallery"/>
            <div className="hidden gallery xl:flex flex-row justify gap-8 px-48 py-8">
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
            <div className="xl:hidden">
                <div className="w-full p-2">
                    <div className="relative h-96 w-full overflow-hidden ">
                        {galleryPhotos.map((photo, index) => (
                            <div
                            key={photo}
                            className={`
                                absolute inset-0 w-full h-full bg-cover bg-center 
                                rounded
                                transition-opacity duration-1000 
                                ease-in-out
                                ${index === currentIndex ? 'opacity-100' : 'opacity-0'}
                                ${photo}
                            `}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Gallery;