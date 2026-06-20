'use client';
import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Play, SkipForward, SkipBack, Fullscreen, PictureInPicture2, Pause } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile"


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

    const isMobile = useIsMobile()

    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [volume, setVolume] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const video = playerRef.current;
        if (!video) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onPause);

        return () => {
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onPause);
        };
    }, []);
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

    useEffect(() => {
        const video = playerRef.current;
        if (!video) return;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onPause);

        return () => {
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onPause);
        };
    }, []);
    useEffect(() => {
        const video = playerRef.current;
        if (!video) return;

        const onLoaded = () => {
            setDuration(video.duration);
        };

        video.addEventListener("loadedmetadata", onLoaded);

        return () => {
            video.removeEventListener("loadedmetadata", onLoaded);
        };
    }, []);    const containerRef = useRef<HTMLDivElement>(null);

    const togglePlay = () => {
        const video = playerRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const changeVolume = (val: number) => {
        const video = playerRef.current;
        if (!video) return;

        video.volume = val;
        setVolume(val);
    };

    const changeSpeed = (rate: number) => {
        const video = playerRef.current;
        if (!video) return;

        video.playbackRate = rate;
        setSpeed(rate);
        setShowSpeedMenu(false);
    };


    const handleTimeUpdate = () => {
        if (!playerRef.current) return;

        const video = playerRef.current;
        setCurrentTime(video.currentTime);

        const current = video.currentTime;

        // 🔥 PROGRESS UPDATE (اینجا باید باشه)
        const percent =
            video.duration && !isNaN(video.duration)
                ? (video.currentTime / video.duration) * 100
                : 0;

        setProgress(isNaN(percent) ? 0 : percent);
        // اگر segment تمام شد
        if (current >= end && !segmentFinished) {
            video.pause();
            setShowControls(true);
            setSegmentFinished(true);
            setForcePaused(true);
            return;
        }

        // اگر باید پاز بماند
        if (forcePaused) {
            video.pause();
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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

    const SKIP_SECONDS = 4; // ← اینو هرچی بخوای کن (مثلاً 10 یا 30)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const video = playerRef.current;
            if (!video) return;

            if (e.key === 'ArrowRight') {
                video.currentTime = Math.min(
                    video.currentTime + SKIP_SECONDS,
                    video.duration
                );
            }

            if (e.key === 'ArrowLeft') {
                video.currentTime = Math.max(
                    video.currentTime - SKIP_SECONDS,
                    0
                );
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    return (
        <div ref={containerRef} className="relative w-full h-full bg-black flex items-center justify-center">
            <video
                ref={playerRef}
                src={url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => {
                    setShowControls(true);
                    setSegmentFinished(true);
                    setForcePaused(true);
                }}
                className="w-full h-full object-contain"
                controls={false}
                onClick={() => {
                    const video = playerRef.current;
                    if (!video) return;

                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                }}
            />
            {/* CONTROLS */}
            <div className="absolute bottom-0 left-0 right-0 z-50 bg-black/60 text-white flex items-center justify-between px-3 py-1">
                <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                <div className="w-full absolute bottom-8 left-0 px-3">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={isNaN(progress) ? 0 : progress}
                        onChange={(e) => {
                            const video = playerRef.current;
                            if (!video || !video.duration) return;

                            const newTime =
                                (Number(e.target.value) / 100) * video.duration;

                            video.currentTime = newTime;
                        }}
                        className="w-full"
                    />
                </div>

                {/* PLAY / PAUSE */}
                <button onClick={() => {
                    if (!playerRef.current) return;

                    if (playerRef.current.paused) {
                        playerRef.current.play();
                    } else {
                        playerRef.current.pause();
                    }
                }}>
                    {isPlaying ? <Pause size={20} color="white"/> : <Play size={20} color="white"/>}
                </button>

                {/* VOLUME */}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={(e) => {
                        if (!playerRef.current) return;
                        playerRef.current.volume = Number(e.target.value);
                    }}
                />
                <div className='flex items-center gap-4'>

                {/* SPEED */}
                <select
                    className="text-foreground border-foreground bg-background px-2 py-1 rounded"
                    value={speed}
                    onChange={(e) => {
                        const value = Number(e.target.value);

                        if (!playerRef.current) return;

                        playerRef.current.playbackRate = value;
                        setSpeed(value);
                    }}
                >
                    <option value="0.5">0.5x</option>
                    <option value="1">1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                </select>

                {/*pip*/}
                <button
                    onClick={async () => {
                        const video = playerRef.current;
                        if (!video) return;

                        try {
                            // اگر already PiP هست → خارج شو
                            if (document.pictureInPictureElement) {
                                await document.exitPictureInPicture();
                            } else {
                                await video.requestPictureInPicture();
                            }
                        } catch (err) {
                            console.log("PiP not supported", err);
                        }
                    }}
                >
                    <PictureInPicture2 size={20} color="white"/>
                </button>

                {/* FULLSCREEN */}
                <button onClick={() => {
                    const el = containerRef.current;
                    if (!el) return;

                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        el.requestFullscreen();
                    }
                }}>
                    <Fullscreen size={20} color="white"/>
                </button>
            </div>

            </div>

            {showControls && (
                <div dir='ltr' className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm space-x-6">

                    <button
                        onClick={handlePrev}
                        className="p-4 border-2 border-acn1 rounded-xl hover:bg-acn1 transition cursor-pointer"
                    >
                        <SkipBack size={isMobile ? 16 : 40} color="white" />
                    </button>

                    <button
                        onClick={handleRepeat}
                        className="p-4 border-2 border-acn1 rounded-xl hover:bg-acn1 transition cursor-pointer"
                    >
                        <RotateCcw size={isMobile ? 16 : 40} color="white" />
                    </button>

                    <button
                        onClick={handlePlayContinue}
                        className="p-4 border-2 border-acn1 rounded-xl hover:bg-acn1 transition cursor-pointer"
                    >
                        <Play size={isMobile ? 16 : 40} color="white" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="p-4 border-2 border-acn1 rounded-xl hover:bg-acn1 transition cursor-pointer"
                    >
                        <SkipForward size={isMobile ? 16 : 40} color="white" />
                    </button>

                </div>
            )}
        </div>
    );
};

export default CustomVideoPlayer;
