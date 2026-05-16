import { useQRCode } from 'next-qrcode';

import { MdOutlineMonochromePhotos } from "react-icons/md";

const SharedQR = () => {
    const { Canvas } = useQRCode();

    return (
        <div className="flex flex-col justify-center items-center lg:h-full w-96 bg-transparent border border-white/60 mx-20 rounded-lg shadow-lg shadow-gray-500">
            <Canvas
                text={`https://ron.dreamplanfix.com`}
                options={{
                    type: 'image/jpeg',
                    quality: 0.3,
                    errorCorrectionLevel: 'H',
                    margin: 3,
                    scale: 4,
                    width: 340,
                    // color: {
                    //     dark: '#010599FF',
                    //     light: '#FFFFFFF'
                    // }
                }}
            />
            <span 
                className="flex items-center mt-8 text-2xl text-white"
            >
                Share your 
                <span className="font-bold ml-4">
                    <MdOutlineMonochromePhotos size="40" />
                </span> 
            </span>
        </div>
    );
}

export default SharedQR;

