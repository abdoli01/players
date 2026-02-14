'use client';

import React, { useState } from "react";
import {
    useGetProfileKeywordsQuery,
    useGetProfileQuery,
} from "@/services/api/profileApi";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const ProfilePage = () => {
    /* ---------- REDUX ---------- */
    const seasonId =
        useAppSelector((s) => s.season.currentSeasonId) ?? undefined;

    const user = useAppSelector((s) => s.user.user);
    const playerId = user?.playerId ?? undefined;

    /* ---------- LOCAL STATE ---------- */
    const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);

    /* ---------- KEYWORDS ---------- */
    const { data: keywords = [] } = useGetProfileKeywordsQuery({
        keyword: "PLAYER",
    });

    /* ---------- DERIVED ACTIVE KEY ---------- */
    const activeKey = selectedKey ?? keywords[0]?.key;

    /* ---------- PROFILE DATA ---------- */
    const { data: profileData, isFetching } = useGetProfileQuery(
        {
            keyword: "PLAYER",
            key: activeKey,
            playerId,
            seasonId,
        },
        {
            skip: !activeKey || !playerId || !seasonId,
        }
    );

    const data = profileData?.data;

    /* ---------- NORMALIZED DATA (NO useMemo) ---------- */
    const pieData =
        data?.pie
            ? Object.entries(data.pie).map(([name, value]) => ({
                name,
                value,
            }))
            : [];

    const barData:any = Array.isArray(data?.bar?.value)
        ? data!.bar
        : [];

    return (
        <div className="py-4">
            {/* ---------- KEYWORDS ---------- */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {keywords.map((item) => (
                    <Button
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
                <div className="col-span-12 lg:col-span-3 space-y-1">
                    {/* Positions */}
                    <Card className='py-4'>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {data?.positionsAndGrade?.title}
                            </CardTitle>
                            <span className="text-sm font-semibold text-foreground">
                                {data?.positionsAndGrade?.value ?? "-"}
                              </span>
                        </CardHeader>
                    </Card>

                    {/* Minutes Played */}
                    <Card className='py-4'>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {data?.minutesPlayed?.title}
                            </CardTitle>
                            <span className="text-sm font-semibold text-foreground">
                                {data?.minutesPlayed?.value ?? "-"}
                              </span>
                        </CardHeader>
                    </Card>

                    {/* Overall Index */}
                    <Card className='py-4'>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {data?.overallIndex?.title}
                            </CardTitle>
                            <span className="text-sm font-bold text-green-500">
                                {data?.overallIndex?.value ?? "-"}
                              </span>
                        </CardHeader>
                    </Card>
                </div>


                {/* ---------- RIGHT CHARTS ---------- */}
                <div className="col-span-12 lg:col-span-6 space-y-4">
                    <Card className="h-[500px]">
                        <CardHeader>
                            <CardTitle>Pie Chart</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={90}
                                    />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="h-[500px]">
                        <CardHeader>
                            <CardTitle>{barData.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData.value}>
                                    <XAxis dataKey="title" />
                                    <YAxis />
                                    <Tooltip
                                        cursor={false}
                                        contentStyle={{
                                            backgroundColor: "#09090b",
                                            borderRadius: "8px",
                                            border: "1px solid #27272a",
                                        }}
                                        labelStyle={{ color: "#a1a1aa" }}
                                        itemStyle={{ color: "#65ff00" }}
                                    />
                                    <Bar dataKey="value" fill="#65ff00"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {isFetching && (
                <div className="mt-4 text-sm text-muted-foreground">
                    Loading profile data...
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
