"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Icon from "./Icon";

// Dynamically import ReactPlayer
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface WatermarkedVideoPlayerProps {
    url: string;
}

const WatermarkedVideoPlayer = ({ url }: WatermarkedVideoPlayerProps) => {
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div 
            className="relative aspect-[9/16] w-full rounded-lg overflow-hidden bg-black shadow-lg cursor-pointer group"
            onClick={toggleMute}
        >
            <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                playing={true}
                muted={isMuted}
                loop={true}
                controls={false} // Disable default controls
                playsinline={true}
            />
            {/* Watermark */}
            <div className="absolute top-2 right-3 text-white text-sm font-bold opacity-50 pointer-events-none">
                COLLABS
            </div>

            {/* Custom Mute/Unmute Control */}
            <div className="absolute bottom-2 right-2 p-1.5 bg-black bg-opacity-40 rounded-full transition-opacity opacity-0 group-hover:opacity-100">
                <Icon
                    name={isMuted ? "volume-off" : "volume-high"}
                    className="w-5 h-5 text-white"
                />
            </div>
        </div>
    );
};

export default WatermarkedVideoPlayer; 