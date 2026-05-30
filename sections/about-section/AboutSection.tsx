import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { ABOUT_CONTENT } from "@/config/content";

const AboutSection = () => {
    const { title, image, paragraphs } = ABOUT_CONTENT;

    return (
        <section id="about" className="w-full bg-[#fbfaf7] text-neutral-900 py-20 sm:py-28 md:py-36 px-6 sm:px-12 md:px-24 flex justify-center items-center">
            
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                <div className="w-full lg:col-span-5">
                    <FadeIn direction="left" delay={0.1}>
                        <div className="relative overflow-hidden rounded-sm p-3 bg-white border border-neutral-200/60 shadow-md aspect-[4/5]">
                            <div className="relative w-full h-full overflow-hidden group">
                                <Image 
                                    className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105 filter grayscale hover:grayscale-0 transition-all duration-700" 
                                    src={image?.src || "/images/camera-shot.png"}
                                    alt={image?.alt || "camera shot image"}
                                    fill
                                    sizes="(max-w-1024px) 100vw, 40vw"
                                    priority={true}
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>
                <div className="w-full lg:col-span-7 flex flex-col gap-8 lg:pl-6">
                    <FadeIn direction="right" delay={0.3}>
                        <span className="text-xs font-semibold tracking-[0.3em] text-neutral-400 uppercase block mb-2">
                            The Story Behind The Lens
                        </span>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-neutral-900 font-serif lowercase italic">
                            {title ? title.toLowerCase() : "about us."}
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-neutral-900 font-serif italic">
                            About us
                        </h2>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.5}>
                        <div className="flex flex-col gap-6 text-neutral-600 font-serif font-light text-base sm:text-lg leading-loose max-w-xl">
                            <p className="first-letter:text-4xl first-letter:font-normal first-letter:text-neutral-900 first-letter:mr-2 first-letter:float-left">
                                {paragraphs?.[0]}
                            </p>
                            <p className="text-neutral-500 font-sans text-sm sm:text-base tracking-wide">
                                {paragraphs?.[1]}
                            </p>
                        </div>
                    </FadeIn>
                </div>

            </div>
        </section>
    );
}

export default AboutSection;