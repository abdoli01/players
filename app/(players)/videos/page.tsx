"use client";

import React, { useState } from "react";
import { VideoCard } from "@/app/(players)/videos/components/VideoCard";
import CustomVideoPlayer from "@/app/(players)/videos/components/CustomVideoPlayer";
import { Button } from "@/components/ui/button";

import {
    Monitor,
    FileArchive,
    Download,
    Square,
} from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import {
    useGetVideoKeywordsQuery,
    useGetVideoItemsQuery,
    useLazyGetVideosQuery,
} from "@/services/api/videosApi";

import { useAppSelector } from "@/store/hooks";

import { VideoFiltersModal } from "./components/VideoFiltersModal";
import {Spinner} from "@/components/Spinner";

const Page = () => {
    const t = useTranslations("Videos");
    const locale = useLocale();
    const isRtl = locale === "fa";

    const user = useAppSelector((s) => s.user.user);

    // ========================
    // STATE
    // ========================
    const [index, setIndex] = useState(-1);
    const [monitorActive, setMonitorActive] = useState(false);
    const [forcePlay, setForcePlay] = useState(0);

    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [selectedItemsPath, setSelectedItemsPath] = useState<string[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<number[]>([]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // ========================
    // API
    // ========================
    const { data: videoKeywords = [], isLoading: isLoadingKeywords } =
        useGetVideoKeywordsQuery({
            keyword: user?.accountType,
        });

    const activeKey = selectedKey ?? videoKeywords[0]?.key;

    const { data: itemsData } =
        useGetVideoItemsQuery(
            {
                keyword: user?.accountType,
                key: activeKey,
            },
            { skip: !activeKey }
        );

    const itemsTree = itemsData?.data?.items ?? [];

    const [fetchVideos, { data: videosData, isFetching }] =
        useLazyGetVideosQuery();

    const videos = videosData?.data?.items ?? [];

    const currentVideo = videos[index];

    // ========================
    // HANDLERS
    // ========================
    const handleGetVideos = () => {
        if (!activeKey || !selectedItemsPath.length) return;

        fetchVideos({
            keyword: user?.accountType,
            key: activeKey,
            playerId: user?.playerId,
            sessionId: "sessionId",
            page: 1,
            limit: 10,
            items: selectedItemsPath,
        });

        setIsFilterOpen(false);
    };

    const toggleVideoSelection = (i: number) => {
        setSelectedVideos((prev) =>
            prev.includes(i)
                ? prev.filter((idx) => idx !== i)
                : [...prev, i]
        );
    };

    const toggleSelectAll = () => {
        if (selectedVideos.length === videos.length) {
            setSelectedVideos([]);
        } else {
            setSelectedVideos(videos.map((_, i) => i));
        }
    };

    const handlePlayVideo = (i: number) => {
        setIndex(i);
        setForcePlay((prev) => prev + 1);
    };
    const goNext = () => {
        if (index < videos.length - 1) {
            setIndex(index + 1);
        }
    };

    const goPrevious = () => {
        if (index > 0) setIndex(index - 1);
    };

    if (isLoadingKeywords) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <Spinner />
            </div>
        );
    }

    // ========================
    // RENDER
    // ========================
    return (
        <div className="py-2">

            {/* ================== KEYWORDS ================== */}
                <div className={`flex gap-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide ${isRtl ? 'pl-6' : 'pr-6'}`}>
                {(
                    videoKeywords.map((item) => (
                        <Button
                            key={item.key}
                            className="shrink-0 min-w-[100px]"
                            variant={
                                activeKey === item.key ? "default" : "outline"
                            }
                            onClick={() => {
                                setSelectedKey(item.key);
                                setSelectedItemsPath([]);
                            }}
                        >
                            {item.title}
                        </Button>
                    )
                ))}
            </div>

            {/* ================== MAIN GRID ================== */}
            <div className="flex flex-col lg:flex-row gap-4">



                {/* ================== PLAYER ================== */}
                <div className="order-1 lg:order-2 lg:flex-1">
                    {currentVideo ? (
                        <>
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-sm">
                                    {currentVideo?.videoTitle}
                                </div>

                                <button
                                    onClick={() =>
                                        setMonitorActive((prev) => !prev)
                                    }
                                    className={`p-1 border-2 border-acn1 rounded-md ${
                                        monitorActive ? "bg-acn1" : ""
                                    }`}
                                >
                                    <Monitor size={16} />
                                </button>
                            </div>

                            <CustomVideoPlayer
                                url={
                                    monitorActive
                                        ? currentVideo.broadcastVideoSource
                                        : currentVideo.tacticalVideoSource
                                }
                                start={parseFloat(
                                    monitorActive
                                        ? currentVideo.broadcastStartTimeCode
                                        : currentVideo.tacticalStartTimeCode
                                )}
                                end={parseFloat(
                                    monitorActive
                                        ? currentVideo.broadcastEndTimeCode
                                        : currentVideo.tacticalEndTimeCode
                                )}
                                resetTrigger={forcePlay}
                                onNext={goNext}
                                onPrev={goPrevious}
                            />
                        </>
                    ) : (
                        <div className="hidden lg:block text-center text-sm mt-10">
                            {t("noVideoSelected")}
                        </div>
                    )}
                </div>

                {/* ================== LIST ================== */}
                <div className="order-2 lg:order-1 flex flex-col lg:w-1/4">

                    {/* TOP ACTIONS */}
                    <div className="flex items-center gap-1 justify-end mb-2">

                        {/* FILTER MODAL */}
                        <VideoFiltersModal
                            open={isFilterOpen}
                            onOpenChange={setIsFilterOpen}
                            itemsTree={itemsTree}
                            selectedItemsPath={selectedItemsPath}
                            setSelectedItemsPath={setSelectedItemsPath}
                            onSubmit={handleGetVideos}
                        />

                        <button className="p-1 border-2 border-acn1 hover:bg-acn1 rounded-md">
                            <FileArchive size={16} />
                        </button>

                        <button className="p-1 border-2 border-acn1 hover:bg-acn1 rounded-md">
                            <Download size={16} />
                        </button>

                        <button
                            className={`p-1 border-2 border-acn1 hover:bg-acn1 rounded-md ${
                                selectedVideos.length === videos.length &&
                                videos.length > 0
                                    ? "bg-acn1"
                                    : ""
                            }`}
                            onClick={toggleSelectAll}
                        >
                            <Square size={16} />
                        </button>
                    </div>

                    {/* LIST */}
                    <div className="overflow-y-auto flex-1 space-y-1">
                        {isFetching ? (
                            <div className="text-center text-sm">
                                {t("loading")}
                            </div>
                        ) : videos.length ? (
                            videos.map((video, i) => (
                                <VideoCard
                                    key={i}
                                    title={video?.videoTitle}
                                    onPlay={() => handlePlayVideo(i)}
                                    checked={selectedVideos.includes(i)}
                                    onCheck={() =>
                                        toggleVideoSelection(i)
                                    }
                                />
                            ))
                        ) : (
                            <div className="text-center text-sm">
                                {t("noResults")}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;