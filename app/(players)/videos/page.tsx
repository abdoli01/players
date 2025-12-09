'use client';
import React from 'react';
import { VideoCard } from "@/app/(players)/videos/components/VideoCard";
import videos from "@/data/videos.json";

const Page = () => {
    return (
        <div className="py-4">
            <div className="grid grid-cols-12 gap-4">

                {/* ستون سمت چپ: VideoCard ها */}
                <div className="col-span-3 flex flex-col gap-2">
                    {videos.map((video, index) => (
                        <VideoCard
                            key={video.id || index}       // حتماً یک key داشته باش
                            title={video.title}           // عنوان از JSON
                            code={video.player}           // بازیکن یا کد از JSON
                            onCheck={() => console.log("کلیک شد:", video.id)}
                        />
                    ))}
                </div>

                {/* ستون سمت راست: VideoPlayer ها */}
                <div className="col-span-9 grid grid-cols-2 gap-4">
                    hiiiiiiii
                </div>

            </div>
        </div>
    );
};

export default Page;
