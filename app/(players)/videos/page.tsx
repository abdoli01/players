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

    // ========================
    // RENDER
    // ========================
    return (
        <div className="py-4 space-y-4">

            {/* ================== KEYWORDS ================== */}
            <div className="flex flex-wrap gap-2">
                {isLoadingKeywords ? (
                    <div className="text-sm">{t("loading")}</div>
                ) : (
                    videoKeywords.map((item) => (
                        <Button
                            key={item.key}
                            variant={
                                activeKey === item.key
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => {
                                setSelectedKey(item.key);
                                setSelectedItemsPath([]);
                            }}
                        >
                            {item.title}
                        </Button>
                    ))
                )}
            </div>

            {/* ================== MAIN GRID ================== */}
            <div className="grid grid-cols-12 gap-4">

                {/* ================== LIST ================== */}
                <div className="col-span-12 lg:col-span-3 flex flex-col h-[400px]">

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

                {/* ================== PLAYER ================== */}
                <div className="col-span-12 lg:col-span-9">
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
                            />
                        </>
                    ) : (
                        <div className="text-center text-sm mt-10">
                            {t("noVideoSelected")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;