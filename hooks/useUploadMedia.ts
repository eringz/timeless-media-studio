import { useState, useEffect, useRef } from "react";
import { cameraService } from "@/services/cameraService"; 

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

    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraRef = useRef<HTMLVideoElement>(null);

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

    const handleCameraClick = async () => {
        setIsDisplay(false);
        setIsCameraActive(true);
        console.log(`isCameraActive: ${isCameraActive}`);

        setTimeout(async () => {
            if (cameraRef.current) {
                try {
                    await cameraService.startCamera(cameraRef.current);
                } catch (error) {
                    setIsCameraActive(false);
                    alert("Failed to start in-app camera device")
                }
            }
        }, 50);
    }

    const executeCapture = async () => {
        if (!cameraRef.current) return;

        try {
            setIsCapturing(true);
            const file = await cameraService.capturePhoto(cameraRef.current);

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            await onUploadTrigger(dataTransfer.files);
            closeCamera();
        } catch (error) {
            console.error(`Capture state handling issue: ${error}`);
        } finally {
            setIsCapturing(false);
        }
    }

    const closeCamera = () => {
        cameraService.stopCamera();
        setIsCameraActive(false)
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
        cameraRef,
        isCameraActive,
        isCapturing,
        toggleDropdown,
        handlePhotoLibraryClick,
        handleCameraClick,
        executeCapture,
        closeCamera,
        handleFileChange
    }
}