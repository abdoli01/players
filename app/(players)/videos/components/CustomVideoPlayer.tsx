'use client';
import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Play, SkipForward } from "lucide-react";

interface VideoPlayerProps {
    url: string;
    start: number;
    end: number;
    onNext?: () => void;
    resetTrigger?: number; // ← اضافه کن
}

const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({ url, start, end, onNext, resetTrigger }) => {
    const playerRef = useRef<HTMLVideoElement>(null);

    const [showControls, setShowControls] = useState(false);
    const [segmentFinished, setSegmentFinished] = useState(false);
    const [forcePaused, setForcePaused] = useState(false); // ← کلید اصلی حل مشکل

    useEffect(() => {
        if (!playerRef.current) return;

        setShowControls(false);
        setSegmentFinished(false);
        setForcePaused(false);

        playerRef.current.currentTime = start;
        playerRef.current.play().catch(() => {}); // ← catch کردن ارور AbortError
    }, [url, start, resetTrigger]); // ← resetTrigger اضافه شد

    useEffect(() => {
        const video = playerRef.current;
        return () => {
            video?.pause(); // ← هنگام unmount از play جلوگیری می‌کنه
        };
    }, []);


    const handleTimeUpdate = () => {
        if (!playerRef.current) return;

        const current = playerRef.current.currentTime;

        // اگر segment تمام شد (طبیعی یا با seek)
        if (current >= end && !segmentFinished) {
            playerRef.current.pause();
            setShowControls(true);
            setSegmentFinished(true);
            setForcePaused(true);   // ← از ادامه پخش جلوگیری کن
            return;
        }

        // اگر باید پاز بماند (تا زمان کلیک کاربر)
        if (forcePaused) {
            playerRef.current.pause();
        }
    };

    const handleRepeat = () => {
        if (!playerRef.current) return;

        setSegmentFinished(false);
        setForcePaused(false);
        setShowControls(false);

        playerRef.current.currentTime = start;
        playerRef.current.play();
    };

    const handlePlayContinue = () => {
        if (!playerRef.current) return;

        setForcePaused(false);     // ← اجازه پخش بده
        setShowControls(false);    // ← Overlay مخفی شود
        playerRef.current.play();  // ← ادامه پخش طبیعی
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
                    setForcePaused(true);
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
