import { useState, useEffect, useRef } from "react";

interface useUploadMediaProps {
    isUploading: boolean;
    onUploadTrigger: (files: FileList | null) => Promise<boolean>
}

export function useUploadMedia({
    isUploading,
    onUploadTrigger
}: useUploadMediaProps) {
    const [isDisplay, setIsDisplay] = useState(false);
    const [date, setDate] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true
            }

            setDate(now.toLocaleDateString("en-PH", options));
        }

        updateClock();

        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, [])

    const toggleDropdown = () => {
        if (!isUploading) {
            setIsDisplay((prev) => !prev);
        }
    }

    const handlePhotoLibraryClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
        setIsDisplay(false);
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const success = await onUploadTrigger(event.target.files);

        if (success && event.target.files) {
            alert(`Upload Success for ${event.target.files.length} files`);
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    }
    
    return {
        date,
        isDisplay,
        fileInputRef,
        toggleDropdown,
        handlePhotoLibraryClick,
        handleFileChange
    }
}