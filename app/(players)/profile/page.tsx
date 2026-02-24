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
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./components/CustomTooltip"

// Chart.js
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend,
    RadialLinearScale
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { ChartBar, ChartPie } from "lucide-react";


ChartJS.register(ArcElement, RadialLinearScale, ChartTooltip, Legend, ChartDataLabels);

const Page = () => {
    /* ---------- REDUX ---------- */
    const seasonId = useAppSelector((s) => s.season.currentSeasonId) ?? undefined;
    const user = useAppSelector((s) => s.user.user);
    const playerId = user?.playerId ?? undefined;
    const [chartType, setChartType] = useState<"polar" | "bar">("polar");

    /* ---------- LOCAL STATE ---------- */
    const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);

    /* ---------- KEYWORDS ---------- */
    const { data: keywords = [] } = useGetProfileKeywordsQuery({ keyword: "PLAYER" });
    const activeKey = selectedKey ?? keywords[0]?.key;

    /* ---------- PROFILE DATA ---------- */
    const { data: profileData, isFetching } = useGetProfileQuery(
        { keyword: "PLAYER", key: activeKey, playerId, seasonId },
        { skip: !activeKey || !playerId || !seasonId }
    );

    const data = profileData?.data;

    /* ---------- NORMALIZED DATA ---------- */
    const pieData =
        data?.pie
            ? Object.values(data.pie).map((item: any) => ({
                name: item.title,
                value: item.value,
            }))
            : [];

    const barData: any = Array.isArray(data?.bar?.value) ? data!.bar : [];

    /* ---------- Polar Area Chart DATA ---------- */
    const polarData = {
        labels: pieData.map(d => d.name),
        datasets: [
            {
                label: "Value",
                data: pieData.map(d => d.value),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                ],
            },
        ],
    };

    return (
        <div className="py-4">
            {/* ---------- KEYWORDS ---------- */}
            <div className="flex gap-2 mb-0 flex-wrap">
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
                <div style={{marginTop:40}} className="col-span-12 lg:col-span-3 space-y-1">
                    {/* Positions */}
                    <Card className='py-4'>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {data?.stats?.positionsAndGrade?.title ?? "-"}
                            </CardTitle>
                            <span className="text-sm font-semibold text-foreground">
                                {data?.stats?.positionsAndGrade?.value?.[0]?.title ?? "-"}
                              </span>
                        </CardHeader>
                    </Card>

                    {/* Minutes Played */}
                    <Card className='py-4'>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {data?.stats?.minutesPlayed?.title}
                            </CardTitle>
                            <span className="text-sm font-semibold text-foreground">
                                {data?.stats?.minutesPlayed?.value ?? "-"}
                              </span>
                        </CardHeader>
                    </Card>

                    {/* Overall Index */}
                    {data?.stats?.overallIndex && (  <Card className='py-4'>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {data?.stats?.overallIndex?.title}
                            </CardTitle>
                            <span className="text-sm font-bold text-green-500">
                                {data?.stats?.overallIndex?.value ?? "-"}
                              </span>
                        </CardHeader>
                    </Card>)}

                    {data?.stats?.defenseIndex && (  <Card className='py-4'>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {data?.stats?.defenseIndex?.title}
                            </CardTitle>
                            <span className="text-sm font-bold text-green-500">
                                {data?.stats?.defenseIndex?.value ?? "-"}
                              </span>
                        </CardHeader>
                    </Card>)}

                    {data?.stats?.attackIndex && (  <Card className='py-4'>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-medium">
                                {data?.stats?.attackIndex?.title}
                            </CardTitle>
                            <span className="text-sm font-bold text-green-500">
                                {data?.stats?.attackIndex?.value ?? "-"}
                              </span>
                        </CardHeader>
                    </Card>)}


                </div>

                {/* ---------- RIGHT CHARTS ---------- */}
                <div className="col-span-12 lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-semibold">
                            {chartType === "polar" ? "Polar Chart" : barData.title}
                        </h2>

                        <button
                            onClick={() =>
                                setChartType(chartType === "polar" ? "bar" : "polar")
                            }
                            className="p-1 rounded-md border-2 border-app-orange hover:bg-app-orange transition"
                        >
                            {chartType === "polar" ? (
                                <ChartBar size={16} />
                            ) : (
                                <ChartPie size={16} />
                            )}
                        </button>
                    </div>
                    <Card className="h-[500px]">
                        <CardContent className="h-full">
                            {chartType === "polar" ? (
                                <PolarArea
                                    data={polarData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            r: {
                                                grid: { display: true },
                                                ticks: { display: true },
                                            },
                                        },
                                        plugins: {
                                            legend: { display: true, position: "top" },
                                            datalabels: { display: false },
                                        },
                                    }}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData.value}>
                                        <XAxis dataKey="title" />
                                        <YAxis />
                                        <Tooltip cursor={false} content={<CustomTooltip />} />
                                        <Bar dataKey="value" fill="#65ff00" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
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

export default Page;
// plugins: {
//     legend: { display: false },
//     datalabels: {
//         color: "#ddd",
//         anchor: "end",      // بیرون slice
//         align: "end",       // جهت label به بیرون
//         offset:50,
//         font: { size: 12 },
//
//         formatter: (value, context) =>
//             context.chart.data.labels?.[context.dataIndex] ?? "",
//
//     },
// },