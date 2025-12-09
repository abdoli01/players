'use client';
import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    url: string;
    start: number; // ثانیه شروع
    end: number;   // ثانیه پایان
}

const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({ url, start, end }) => {
    const playerRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(true);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.currentTime = start;
            playerRef.current.play();
        }
    }, [url, start]);

    const handleTimeUpdate = () => {
        if (playerRef.current && playerRef.current.currentTime >= end) {
            setPlaying(false);
            playerRef.current.pause();
        }
    };

    return (
        <video
            ref={playerRef}
            src={url}
            controls
            autoPlay={playing}
            onTimeUpdate={handleTimeUpdate}
            width="100%"
            height="480px"
        />
    );
};

export default CustomVideoPlayer;
