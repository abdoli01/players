'use client';

import React, { useState } from "react";
import {
    useGetReportKeywordsQuery,
    useGetReportQuery,
} from "@/services/api/reportsApi";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Spinner} from "@/components/Spinner";
import MapRenderer from "./components/MapRenderer";

interface StatItem {
    title: string;
    key: string;
    value: number | string | any[];
    grade: number;
}
interface Stats {
    [key: string]: StatItem;
}


const Page = () => {
    /* ---------- REDUX ---------- */
    const seasonId = useAppSelector((s) => s.season.currentSeasonId) ?? undefined;
    const user = useAppSelector((s) => s.user.user);
    const playerId = user?.playerId ?? undefined;

    /* ---------- LOCAL STATE ---------- */
    const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);

    /* ---------- KEYWORDS ---------- */
    const { data: keywords = [] } = useGetReportKeywordsQuery({ keyword: user?.accountType });
    const activeKey = selectedKey ?? keywords[0]?.key;

    /* ---------- PROFILE DATA ---------- */
    const { data: reportData, isLoading  } = useGetReportQuery(
        { keyword: user?.accountType, key: activeKey, playerId, seasonId },
        { skip: !activeKey || !playerId || !seasonId }
    );

    const data = reportData?.data;
    const stats = data?.stats as Stats | undefined;

    const isReady = activeKey && playerId && seasonId;
    if (!isReady || isLoading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <Spinner />
            </div>
        );
    }


    return (
        <div className="py-4">
            {/* ---------- KEYWORDS ---------- */}
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 pr-6">
                {keywords.map((item) => (
                    <Button
                        className="shrink-0"
                        key={item.key}
                        variant={activeKey === item.key ? "default" : "outline"}
                        onClick={() => setSelectedKey(item.key)}
                    >
                        {item.title}
                    </Button>
                ))}
            </div>

            {/* ---------- GRID ---------- */}
            <div className="grid grid-cols-12 gap-4">

                {/* ---------- LEFT CARDS ---------- */}
                <div
                    className="col-span-12 lg:col-span-3 space-y-1 order-2 lg:order-1 lg:mt-10"
                >
                    {stats &&
                        Object.values(stats).map((item) => (
                            <Card className="py-4" key={item.key}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                        {item.title ?? "-"}
                                    </CardTitle>
                                    <span className="text-sm font-semibold text-foreground">
                            {Array.isArray(item.value)
                                ? item.value.map(v => v.title).join(", ")
                                : item.value ?? "-"}
                        </span>
                                </CardHeader>
                            </Card>
                        ))}
                </div>

                {/* ---------- RIGHT MAPS ---------- */}
                <div className="col-span-12 lg:col-span-6 space-y-4 order-1 lg:order-2">
                    <MapRenderer map={data?.map} />
                </div>

            </div>
        </div>
    );
};

export default Page;
