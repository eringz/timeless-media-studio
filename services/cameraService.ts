export class CameraService {
    private stream: MediaStream | null = null;

    async startCamera  (videoElement: HTMLVideoElement, facingMode: "user" | "environment"): Promise<MediaStream>  {
        this.stopCamera();
        
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: {ideal: 720 }
                },
                audio: false,
            });

            videoElement.srcObject = this.stream;
            
            return this.stream;
        } catch (error) {
            console.error(`Camera access error: ${error}`);
            throw new Error("Could not access camera device");
        }
    }

    capturePhoto(videoElement: HTMLVideoElement): Promise<File> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            canvas.width = videoElement.videoWidth || 1280;
            canvas.height = videoElement.videoHeight || 720;

            const context = canvas.getContext("2d");
            if (!context) return reject(new Error("Canvas failure."));


            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error("Blob creation failed"));

                const file = new File([blob], `studio-capture-${Date.now()}-${Math.random().toString(36).substring(2, 
                    9
                )}.png`, {type: "image/png"});
                resolve(file);
            }, "image/png")
        });
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }
}

export const cameraService = new CameraService;