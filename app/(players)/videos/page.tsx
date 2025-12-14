'use client';
import React, { useState } from 'react';
import { VideoCard } from "@/app/(players)/videos/components/VideoCard";
import CustomVideoPlayer from "@/app/(players)/videos/components/CustomVideoPlayer";
import videos from "@/data/videos.json";
import {Button} from "@/components/ui/button";
import { Monitor,List, Grid,ArrowUp,ArrowDown,SquarePen,FileArchive,Download,Square } from 'lucide-react';


const Page = () => {
    const [index, setIndex] = useState(-1);
    const [monitorActive, setMonitorActive] = useState(false);
    const [forcePlay, setForcePlay] = useState(0);

    const [showFirstList, setShowFirstList] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(-1); // ذخیره آیتم انتخاب شده

    const items1=['ATTACKING','PASSING','DULES','DEFENSIVE','ALL','ACTIONS']
    const items2=['RGRGRG','PASSIHHTHTHTHHTNG','HTH','RHRHRTH','HRHRHRHRHRTHTR','HT']

    const currentVideo = videos[index];

    const goNext = () => {
        if (index < videos.length - 1) {
            setIndex(index + 1);
        }
    };
    const handleMonitorClick = () => {
        setMonitorActive(prev => !prev); // هر بار کلیک، فعال/غیرفعال میشه
        setForcePlay(prev => prev + 1); // ← ریست و پخش دوباره
    };
    const handlePlayVideo = (i: number) => {
        setIndex(i);
        // setMonitorActive(false); // ← وقتی روی Play کلیک شد، مانیتور خاموش می‌شه
        setForcePlay(prev => prev + 1); // ← ریست و پخش دوباره
    };
    const toggleList = () => {
        setShowFirstList(!showFirstList);
        setSelectedIndex(-1); // هر بار لیست عوض شد انتخاب پاک شود
    };
    const currentItems = showFirstList ? items1 : items2;

    return (
        <div className="py-4">
            {/*items*/}
            <div className="flex items-center mb-4 gap-2">
                <Button onClick={toggleList} className="flex items-center gap-2 p-1 rounded-md transition border-2 border-app-orange hover:bg-app-orange">
                    {showFirstList ? <List size={16} /> : <Grid size={16} />}
                </Button>
                <div className="flex flex-wrap gap-2">
                    {currentItems.map((item, index) => (
                        <Button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`${
                                selectedIndex === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                            }`}
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
                {/* لیست ویدیوها */}
                <div className="col-span-12 lg:col-span-4 flex flex-col h-[400px] order-2 lg:order-1">
                    <div className="flex items-center gap-1 justify-end mb-1">
                        <button
                            className="p-1 rounded-md transition border-2 border-app-orange hover:bg-app-orange cursor-pointer"
                        >
                            <FileArchive size={16} color="white" />
                        </button>
                        <button
                            className="p-1 rounded-md transition border-2 border-app-orange hover:bg-app-orange cursor-pointer"
                        >
                            <Download size={16} color="white" />
                        </button>
                        <button
                            className="p-1 rounded-md transition border-2 border-app-orange hover:bg-app-orange cursor-pointer"
                        >
                            <Square size={16} color="white" />
                        </button>
                    </div>
                    <div className='overflow-y-scroll'>
                        {videos.map((video, i) => (
                            <VideoCard
                                key={i}
                                title={video.event_type}
                                code={video.minute + "-" + video.teams}
                                onPlay={() => handlePlayVideo(i)} // ← استفاده از تابع آماده
                            />
                        ))}
                    </div>
                </div>

                {/* پلیر */}
                <div className="col-span-12 lg:col-span-8 order-1 lg:order-2">
                    {currentVideo ? (
                        <>
                            <div className='flex items-center justify-between gap-8 mb-1'>
                                <div className='text-sm'>{currentVideo.title}</div>
                                <div>
                                    {showFirstList ? (   <button
                                        onClick={handleMonitorClick}
                                        className={`p-1 rounded-md transition border-2 border-app-orange hover:bg-app-orange cursor-pointer
                                          ${monitorActive ? 'bg-app-orange' : ''}
                                               `}
                                    >
                                        <Monitor size={16} color="white" />
                                    </button>) : (<div className='flex items-center gap-1'>
                                        <button
                                            className="p-1 rounded-md transition border-2 border-app-orange hover:bg-app-orange cursor-pointer"
                                        >
                                            <SquarePen size={16} color="white" />
                                        </button>
                                        <button
                                            className="p-1 rounded-md transition border-2 border-app-orange hover:bg-app-orange cursor-pointer"
                                        >
                                            <ArrowDown size={16} color="white" />
                                        </button>
                                        <button
                                            className="p-1 rounded-md transition border-2 border-app-orange hover:bg-app-orange cursor-pointer"
                                        >
                                            <ArrowUp size={16} color="white" />
                                        </button>
                                        <button
                                            onClick={handleMonitorClick}
                                            className={`p-1 rounded-md transition border-2 border-app-orange hover:bg-app-orange cursor-pointer
                                          ${monitorActive ? 'bg-app-orange' : ''}
                                               `}
                                        >
                                            <Monitor size={16} color="white" />
                                        </button>
                                    </div>)}
                                </div>
                            </div>
                            <CustomVideoPlayer
                                url={monitorActive ? currentVideo.broadcast.url : currentVideo.technical.url}
                                start={monitorActive ? parseFloat(currentVideo.broadcast.time_start) : parseFloat(currentVideo.technical.time_start)}
                                end={monitorActive ? parseFloat(currentVideo.broadcast.time_end) : parseFloat(currentVideo.technical.time_end)}
                                resetTrigger={forcePlay} // ← اضافه شد
                                onNext={goNext}
                            />
                        </>
                    ) : (
                        <div className="text-white text-center">ویدیویی انتخاب نشده است</div>
                    )}
                </div>

            </div>
        </div>
    );
};


export default Page;
