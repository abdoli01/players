"use client";

import React, { useState } from "react";
import { VideoCard } from "@/app/(players)/videos/components/VideoCard";
import CustomVideoPlayer from "@/app/(players)/videos/components/CustomVideoPlayer";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Monitor,
    List,
    Grid,
    ArrowUp,
    ArrowDown,
    SquarePen,
    FileArchive,
    Download,
    Square,
} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import { useGetVideoKeywordsQuery,useGetVideoItemsQuery,useLazyGetVideosQuery  } from "@/services/api/videosApi";
import { useAppSelector } from "@/store/hooks";


const Page = () => {
    const t = useTranslations("Videos");
    const locale = useLocale();
    const isRtl = locale === "fa";
    // -----------------------
    // States
    // -----------------------
    const [index, setIndex] = useState(-1);
    const [monitorActive, setMonitorActive] = useState(false);
    const [forcePlay, setForcePlay] = useState(0);

    const [showFirstList, setShowFirstList] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [selectedItemsPath, setSelectedItemsPath] = useState<string[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<number[]>([]);

    const user = useAppSelector((s) => s.user.user);


    // -----------------------
    // API
    // -----------------------
    const { data: videoKeywords = [], isLoading: isLoadingKeywords } =
        useGetVideoKeywordsQuery({
            keyword: user?.accountType,
        });
    const activeKey = selectedKey ?? videoKeywords[0]?.key;

    const { data: itemsData, isLoading: isLoadingItems } =
        useGetVideoItemsQuery(
            {
                keyword: user?.accountType,
                key: activeKey,
            },
            {
                skip: !activeKey,
            }
        );
    const itemsTree = itemsData?.data?.items ?? [];

    const [fetchVideos, { data: videosData, isFetching: isLoadingVideos }] =
        useLazyGetVideosQuery();

    const videos = videosData?.data?.items ?? [];

    const currentVideo = videos[index];

    React.useEffect(() => {
        setSelectedItemsPath([]);
    }, [activeKey]);

    // -----------------------
    // Handlers
    // -----------------------
    const getChildren = (level: number) => {
        if (level === 0) return itemsTree;

        let current = itemsTree;

        for (let i = 0; i < level; i++) {
            const key = selectedItemsPath[i];
            const found = current.find((item) => item.key === key);

            if (!found || !found.items) return [];
            current = found.items;
        }

        return current;
    };
    const handleSelect = (level: number, value: string) => {
        const newPath = [...selectedItemsPath.slice(0, level), value];
        setSelectedItemsPath(newPath);
    };

    const goNext = () => {
        if (index < videos.length - 1) {
            setIndex(index + 1);
        }
    };

    const goPrevious = () => {
        if (index > 0) setIndex(index - 1);
    };

    const handleMonitorClick = () => {
        setMonitorActive((prev) => !prev);
        setForcePlay((prev) => prev + 1);
    };

    const handlePlayVideo = (i: number) => {
        setIndex(i);
        setForcePlay((prev) => prev + 1);
    };

    const toggleList = () => {
        setShowFirstList(!showFirstList);
        setSelectedIndex(-1);
        setSelectedKey(null);
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

    // -----------------------
    // Render
    // -----------------------
    return (
        <div className="py-4">
            {/* ================== KEYWORDS ================== */}
            <div className="flex flex-wrap gap-2 mb-4">
                <Button
                    onClick={toggleList}
                    className="bg-background flex items-center gap-2 p-1 rounded-md border-2 border-acn1 hover:bg-acn1"
                >
                    {showFirstList ? (
                        <List size={16} />
                    ) : (
                        <Grid size={16} />
                    )}
                </Button>

                {isLoadingKeywords ? (
                    <div className="text-sm">{t("loading")}</div>
                ) : (
                    videoKeywords.map((item, i) => (
                        <Button
                            key={item.key}
                            variant={activeKey === item.key ? "default" : "outline"}
                            onClick={() => {
                                setSelectedIndex(i);
                                setSelectedKey(item.key);
                            }}
                        >
                            {item.title}
                        </Button>
                    ))
                )}
            </div>
            <div className="grid grid-cols-12 mb-4">
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
                    {Array.from({ length: selectedItemsPath.length + 1 }).map((_, level) => {
                        const options = getChildren(level);

                        if (!options.length) return null;

                        return (
                            <Select

                                key={level}
                                value={selectedItemsPath[level] ?? ""}
                                onValueChange={(value) => handleSelect(level, value)}
                            >
                                <SelectTrigger className={isRtl ? "flex-row-reverse w-full" : "w-full"}>
                                    <SelectValue  placeholder={t("select")} />
                                </SelectTrigger>

                                <SelectContent>
                                    {options.map((item) => (
                                        <SelectItem key={item.key} value={item.key}>
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        );
                    })}
                </div>
            </div>
            <div className="mt-2">
                <Button
                    onClick={() => {
                        if (!activeKey || !selectedItemsPath.length) return;

                        fetchVideos({
                            keyword: user?.accountType,
                            key: activeKey,
                            playerId: user?.playerId,
                            sessionId: "sessionId", // اگر داری
                            page: 1,
                            limit: 10,
                            items: selectedItemsPath,
                        });
                    }}
                >
                    {t("getVideos")}
                </Button>
            </div>


            {/* ================== MAIN ================== */}
            <div className="grid grid-cols-12 gap-4">
                {/* ================== LIST ================== */}
                <div className="col-span-12 lg:col-span-3 flex flex-col h-[400px] order-2 lg:order-1">
                    <div className="flex items-center gap-1 justify-end mb-1">
                        <button className="p-1 border-2 border-acn1 hover:bg-acn1 rounded-md">
                            <FileArchive size={16} />
                        </button>

                        <button className="p-1 border-2 border-acn1 hover:bg-acn1 rounded-md">
                            <Download size={16} />
                        </button>

                        <button
                            className={`p-1 border-2 border-acn1 hover:bg-acn1 rounded-md ${
                                selectedVideos.length === videos.length
                                    ? "bg-acn1"
                                    : ""
                            }`}
                            onClick={toggleSelectAll}
                        >
                            <Square size={16} />
                        </button>
                    </div>

                    {/*<div className="overflow-y-scroll">*/}
                    {/*    {videos.map((video, i) => (*/}
                    {/*        <VideoCard*/}
                    {/*            key={i}*/}
                    {/*            title={video?.event_type}*/}
                    {/*            code={`${video?.minute}-${video?.teams}`}*/}
                    {/*            onPlay={() => handlePlayVideo(i)}*/}
                    {/*            checked={selectedVideos.includes(i)}*/}
                    {/*            onCheck={() => toggleVideoSelection(i)}*/}
                    {/*        />*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>

                {/* ================== PLAYER ================== */}
                {/*<div className="col-span-12 lg:col-span-9 order-1 lg:order-2">*/}
                {/*    {currentVideo ? (*/}
                {/*        <>*/}
                {/*            <div className="flex items-center justify-between mb-1">*/}
                {/*                <div className="text-sm">*/}
                {/*                    {currentVideo.title}*/}
                {/*                </div>*/}

                {/*                <button*/}
                {/*                    onClick={handleMonitorClick}*/}
                {/*                    className={`p-1 border-2 border-acn1 rounded-md ${*/}
                {/*                        monitorActive ? "bg-acn1" : ""*/}
                {/*                    }`}*/}
                {/*                >*/}
                {/*                    <Monitor size={16} />*/}
                {/*                </button>*/}
                {/*            </div>*/}

                {/*            <CustomVideoPlayer*/}
                {/*                url={*/}
                {/*                    monitorActive*/}
                {/*                        ? currentVideo.broadcast.url*/}
                {/*                        : currentVideo.technical.url*/}
                {/*                }*/}
                {/*                start={*/}
                {/*                    monitorActive*/}
                {/*                        ? parseFloat(*/}
                {/*                            currentVideo.broadcast.time_start*/}
                {/*                        )*/}
                {/*                        : parseFloat(*/}
                {/*                            currentVideo.technical.time_start*/}
                {/*                        )*/}
                {/*                }*/}
                {/*                end={*/}
                {/*                    monitorActive*/}
                {/*                        ? parseFloat(*/}
                {/*                            currentVideo.broadcast.time_end*/}
                {/*                        )*/}
                {/*                        : parseFloat(*/}
                {/*                            currentVideo.technical.time_end*/}
                {/*                        )*/}
                {/*                }*/}
                {/*                resetTrigger={forcePlay}*/}
                {/*                onNext={goNext}*/}
                {/*                onPrev={goPrevious}*/}
                {/*            />*/}
                {/*        </>*/}
                {/*    ) : (*/}
                {/*        <div className="text-center">*/}
                {/*            {t("noVideoSelected")}*/}
                {/*        </div>*/}
                {/*    )}*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default Page;