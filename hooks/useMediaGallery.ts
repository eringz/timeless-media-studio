import { useState, useEffect } from "react";
import { mediaService } from "@/services/mediaService";

export interface MediaItem {
    id: string;
    file_name: string;
    file_url: string;
    created_at: string;
}

export const useMediaGallery = () => {
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoadingAlbum, setIsLoadingAlbum] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGallery = async () => {
        try {
            setIsLoadingAlbum(true);
            setError(null);
            const data = await mediaService.getAllMedia();

            console.log("Ito ang bilang ng rows na nakuha:", data?.length);
            console.table(data);

            setMediaList(data || []);
        } catch (error: any) {
            setError(error.message || "Failed to load album resources");
        } finally {
            setIsLoadingAlbum(false);
        }
    };

    const uploadMediaBatch = async (files: FileList | null) => {
        if (!files || files.length === 0) return false;

        const fileArray = Array.from(files);
        setIsUploading(true);
        setError(null);

        try {
            for (const file of fileArray) {
                console.log(`${file.name} starting processing loop.`);
                await mediaService.uploadMedia(file);
            }

            await fetchGallery();
            return true;
        } catch (error: any) {
            console.error(`Execute failed ${error}`);
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    return {
        mediaList,
        isUploading,
        isLoadingAlbum,
        error,
        uploadMediaBatch,
        refreshGallery: fetchGallery,
    }
}