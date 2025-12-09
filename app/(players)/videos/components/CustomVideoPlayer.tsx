'use client';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    url: string;
    start: number; // ثانیه شروع
    end: number;   // ثانیه پایان
}

const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({ url, start, end }) => {
    const playerRef = useRef<ReactPlayer>(null);
    const [playing, setPlaying] = useState(true);

    // وقتی ویدیو آماده شد، به start برو
    const handleReady = () => {
        if (playerRef.current) {
            playerRef.current.seekTo(start, 'seconds');
        }
    };

    // کنترل توقف در زمان end
    const handleProgress = (state: { playedSeconds: number }) => {
        if (state.playedSeconds >= end) {
            setPlaying(false);
        }
    };

    return (
        <ReactPlayer
            ref={playerRef}
            url={url}
            playing={playing}
            controls
            width="100%"
            height="480px"
            onReady={handleReady}
            onProgress={handleProgress}
        />
    );
};

export default CustomVideoPlayer;
