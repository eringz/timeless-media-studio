import { useState, useEffect } from "react";


const WordAnimation = ({ word }: { word: string }) => {
  const [displayWord, setDisplayWord] = useState(word);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayWord(word);
      setAnimate(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [word]);

  return (
    <span
      key={word}
      className={`text-blue-500 inline-block transition-all duration-500 ${
        animate ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {displayWord}
    </span>
  );
};

const words = ['Moment', 'Memory', 'Story', 'Dream', 'Magic', 'Light', 'Frame', 'Essence', 'Beauty', 'Art', 'Vision', 'Soul'];

const HeroSection = () => {
    const [randomWord, setRandomWord] = useState('Moment');

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * words.length);
            setRandomWord(words[randomIndex]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div 
        className="hero-section w-full bg-black text-white relative pt-20 sm:pt-0 min-h-screen flex items-center"
      >
        <div
          className="flex flex-col gap-6 sm:gap-8 px-4 sm:px-24 py-8 sm:py-4 w-full sm:w-96"
        >
          <p className="text-3xl sm:text-6xl md:text-8xl font-bold leading-tight">
            Create Every <WordAnimation word={randomWord} />
          </p>
          <button
            className="px-6 sm:px-8 py-3 sm:py-4 w-40 sm:w-48 border border-white rounded-full hover:bg-white hover:text-black transition duration-300 text-sm sm:text-base"
          >
            Book Now
          </button>
        </div>
      </div>
    );
}

export default HeroSection;