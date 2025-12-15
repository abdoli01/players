'use client';
import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Play, SkipForward, SkipBack } from "lucide-react";

interface VideoPlayerProps {
    url: string;
    start: number;
    end: number;
    onNext?: () => void;
    onPrev?: () => void;
    resetTrigger?: number; // ← اضافه کن
}

const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({ url, start, end, onNext, resetTrigger, onPrev }) => {
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
    const handlePrev = () => {
        if (onPrev) onPrev(); // ← استفاده از prop جدید onPrev
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
                className="w-full"
                controls
            />

            {showControls && (
                <div dir='ltr' className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm space-x-6">

                    <button
                        onClick={handlePrev}
                        className="p-4 border-2 border-app-orange rounded-xl hover:bg-app-orange transition cursor-pointer"
                    >
                        <SkipBack size={40} color="white" />
                    </button>

                    <button
                        onClick={handleRepeat}
                        className="p-4 border-2 border-app-orange rounded-xl hover:bg-app-orange transition cursor-pointer"
                    >
                        <RotateCcw size={40} color="white" />
                    </button>

                    <button
                        onClick={handlePlayContinue}
                        className="p-4 border-2 border-app-orange rounded-xl hover:bg-app-orange transition cursor-pointer"
                    >
                        <Play size={40} color="white" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="p-4 border-2 border-app-orange rounded-xl hover:bg-app-orange transition cursor-pointer"
                    >
                        <SkipForward size={40} color="white" />
                    </button>

                </div>
            )}
        </div>
    );
};

export default CustomVideoPlayer;
