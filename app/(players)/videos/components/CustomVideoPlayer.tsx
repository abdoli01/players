'use client';
import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Play, SkipForward } from "lucide-react";

interface VideoPlayerProps {
    url: string;
    start: number;
    end: number;
    onNext?: () => void;
}

const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({ url, start, end, onNext }) => {
    const playerRef = useRef<HTMLVideoElement>(null);
    const [showControls, setShowControls] = useState(false);
    const [segmentFinished, setSegmentFinished] = useState(false);
    // جلوگیری از نمایش دوباره کنترل‌ها بعد از "ادامه پخش"

    useEffect(() => {
        if (playerRef.current) {
            setShowControls(false);
            setSegmentFinished(false);
            playerRef.current.currentTime = start;
            playerRef.current.play();
        }
    }, [url, start]);

    const handleTimeUpdate = () => {
        if (!playerRef.current) return;

        // اگر این قسمت تمام شده بود و ما پلی ادامه زدیم → دیگه کنترل‌ها نمایش نده
        if (segmentFinished) return;

        if (playerRef.current.currentTime >= end) {
            playerRef.current.pause();
            setShowControls(true);
            setSegmentFinished(true); // این جلوگیری می‌کند از تکرار pause و نمایش Overlay
        }
    };

    const handleRepeat = () => {
        if (playerRef.current) {
            setSegmentFinished(false);
            playerRef.current.currentTime = start;
            playerRef.current.play();
            setShowControls(false);
        }
    };

    const handlePlayContinue = () => {
        if (playerRef.current) {
            playerRef.current.play();
            // ❗ مهم: دیگه اجازه نده Overlay دوباره ظاهر بشه
            setShowControls(false);
        }
    };

    const handleNext = () => {
        if (onNext) onNext();
    };

    return (
        <div className="relative w-full">

            <video
                ref={playerRef}
                src={url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => {
                    setShowControls(true);
                    setSegmentFinished(true);
                }}
                className="w-full h-[480px]"
                controls
            />

            {showControls && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm space-x-6">

                    <button
                        onClick={handleRepeat}
                        className="p-4 border-2 border-green-500 rounded-xl hover:bg-green-500/30 transition"
                    >
                        <RotateCcw size={40} color="white" />
                    </button>

                    <button
                        onClick={handlePlayContinue}
                        className="p-4 border-2 border-green-500 rounded-xl hover:bg-green-500/30 transition"
                    >
                        <Play size={40} color="white" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="p-4 border-2 border-green-500 rounded-xl hover:bg-green-500/30 transition"
                    >
                        <SkipForward size={40} color="white" />
                    </button>

                </div>
            )}
        </div>
    );
};

export default CustomVideoPlayer;
