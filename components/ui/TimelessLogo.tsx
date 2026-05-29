import Link from "next/link";
import TransitionLink from "@/components/TransitionLink";


import { MdOutlineMonochromePhotos } from "react-icons/md";

interface TimeLogoProps {
    onClick?: () => void;
}

const TimelessLogo = ({ onClick }: TimeLogoProps) => {
    return (
        <TransitionLink
            href="/" 
            onClick={onClick}
            className="text-2xl sm:text-4xl font-bold"
        >
            <MdOutlineMonochromePhotos size="60" />
        </TransitionLink>
    )
} 

export default TimelessLogo;