
const AboutSection = () => {
    return (
        <div 
            id="about" className="about flex flex-col lg:flex-row justify-between items-center gap-6 sm:gap-8 p-4 sm:p-8 md:p-24 bg-white text-black w-full"
        >
            {/** About us section photo */}
            <div className="w-full lg:w-1/2">
                <img 
                    className="w-full h-auto rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
                    src="/images/camera-shot.png"
                    alt="camera shot image"
                />
            </div>
        
            {/** About Us short introduction */}
            <div className="flex flex-col gap-4 sm:gap-8 w-full lg:w-1/2">
                <h2 className="text-2xl sm:text-4xl font-bold">ABOUT US</h2>
                <p className="text-sm sm:text-base leading-relaxed">
                    We believe that every second holds a story worth keeping. What started as a simple passion for the lens has evolved into a dedicated mission: to freeze time for the moments that matter most.
                </p>
                <p className="text-sm sm:text-base leading-relaxed">
                    From the quiet, candid smiles to the grandest celebrations of life, our goal is to capture the raw emotion and beauty of your journey. We don't just take pictures; we preserve legacies, one frame at a time.
                </p>
            </div>
        </div>
    );
}

export default AboutSection;

