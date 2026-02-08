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

    const barData = Array.isArray(data?.bar?.value)
        ? data!.bar.value
        : [];

    return (
        <div className="p-4">
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
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Positions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data?.positionsAndGrade?.value ?? "-"}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Minutes Played</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data?.minutesPlayed?.value ?? "-"}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Index</CardTitle>
                        </CardHeader>
                        <CardContent className="text-green-500 font-bold">
                            {data?.overallIndex?.value ?? "-"}
                        </CardContent>
                    </Card>
                </div>

                {/* ---------- RIGHT CHARTS ---------- */}
                <div className="col-span-12 lg:col-span-6 space-y-4">
                    <Card className="h-[300px]">
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

                    <Card className="h-[300px]">
                        <CardHeader>
                            <CardTitle>Bar Chart</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" />
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
