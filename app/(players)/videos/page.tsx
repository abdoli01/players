'use client';
import React, { useState } from 'react';
import { VideoCard } from "@/app/(players)/videos/components/VideoCard";
import CustomVideoPlayer from "@/app/(players)/videos/components/CustomVideoPlayer";
import videos from "@/data/videos.json";

const Page = () => {
    const [index, setIndex] = useState(-1);

    const currentVideo = videos[index];

    const goNext = () => {
        if (index < videos.length - 1) {
            setIndex(index + 1);
        }
    };

    return (
        <div className="py-4">
            <div className="grid grid-cols-12 gap-4">

                {/* لیست ویدیوها */}
                <div className="col-span-3 flex flex-col gap-2">
                    {videos.map((video, i) => (
                        <VideoCard
                            key={i}
                            title={video.event_type}
                            code={video.minute + "-" + video.teams}
                            onPlay={() => setIndex(i)}
                        />
                    ))}
                </div>

                {/* پلیر */}
                <div className="col-span-9">
                    {currentVideo ? (
                        <CustomVideoPlayer
                            url={currentVideo.technical.url}
                            start={parseFloat(currentVideo.technical.time_start)}
                            end={parseFloat(currentVideo.technical.time_end)}
                            onNext={goNext}
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
