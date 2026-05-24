import Link from "next/link";
import TransitionLink from "@/components/TransitionLink";


import { MdOutlineMonochromePhotos } from "react-icons/md";


const TimelessLogo = () => {
    return (
        <TransitionLink
            href="/" 
            className="text-2xl sm:text-4xl font-bold"
        >
            <MdOutlineMonochromePhotos size="60" />
        </TransitionLink>
    )
} 

export default TimelessLogo;