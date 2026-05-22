import { getSupabase } from "@/utils/supabase/client";

export interface UploadMediaResponse {
    fileName: string;
    fileUrl: string;
}

export const mediaService = {
    
    async uploadMedia(file: File, bucketName: string = "timeless-media-studio"): Promise<UploadMediaResponse> {
        
        const supabase = getSupabase();

        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        console.log(`Uploading to bucket: ${bucketName}`);
        
        const { data: storageData, error: storageError } = await supabase.storage
            .from(bucketName)
            .upload(uniqueFileName, file, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (storageError) throw new Error(`Storage Upload Failed: ${storageError.message}`);

        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(uniqueFileName);

        const publicUrl = urlData.publicUrl;
        console.log(`public URL: ${publicUrl}`);

        const { data: dbData, error: dbError } = await supabase
            .from("media_gallery")
            .insert([
                {
                    file_name: file.name,
                    file_url: publicUrl,
                }
            ])
            .select();

        if (dbError) throw new Error(`Database Insert Failed: ${dbError.message}`);

        return {
            fileName: file.name,
            fileUrl: publicUrl
        };
    },

    async getAllMedia() {
        
        const supabase = getSupabase();
        
        const { data, error } = await supabase
            .from("media_gallery")
            .select("*")
            .order("created_at", { ascending: false });
        
        if (error) throw new Error(`Failed to fetch media gallery: ${error.message}`);  

        return data || [];
    }
};