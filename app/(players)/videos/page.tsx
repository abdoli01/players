'use client';
import React, { useState } from 'react';
import { VideoCard } from "@/app/(players)/videos/components/VideoCard";
import CustomVideoPlayer from "@/app/(players)/videos/components/CustomVideoPlayer";
import videos from "@/data/videos.json";

const Page = () => {
    const [currentVideo, setCurrentVideo] = useState<{
        url: string;
        start: number;
        end: number;
    } | null>(null);
    console.log('hii',currentVideo)
    return (
        <div className="py-4">
            <div className="grid grid-cols-12 gap-4">

                {/* ستون سمت چپ: VideoCard ها */}
                <div className="col-span-3 flex flex-col gap-2">
                    {videos.map((video, index) => (
                        <VideoCard
                            key={video.id || index}
                            title={video.event_type}
                            code={video.minute + "-" + video.teams}
                            onPlay={() => {
                                setCurrentVideo({
                                    url: video.technical.url,
                                    start: parseFloat(video.technical.time_start),
                                    end: parseFloat(video.technical.time_end),
                                });
                            }}
                        />
                    ))}
                </div>

                {/* ستون سمت راست: VideoPlayer */}
                <div className="col-span-9">
                    {currentVideo ? (
                        <CustomVideoPlayer
                            url={currentVideo.url}
                            start={currentVideo.start}
                            end={currentVideo.end}
                        />
                    ) : (
                        <div className="text-white text-center">ویدیویی انتخاب نشده است</div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Page;
