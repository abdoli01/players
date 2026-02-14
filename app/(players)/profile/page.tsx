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


ChartJS.register(ArcElement, RadialLinearScale, ChartTooltip, Legend, ChartDataLabels);

const Page = () => {
    /* ---------- REDUX ---------- */
    const seasonId = useAppSelector((s) => s.season.currentSeasonId) ?? undefined;
    const user = useAppSelector((s) => s.user.user);
    const playerId = user?.playerId ?? undefined;

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
                            <CardTitle>Polar Area Chart</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center w-full h-full px-0">
                            <div className="w-full h-full">
                                {/*<PolarArea*/}
                                {/*    data={polarData}*/}
                                {/*    options={{*/}
                                {/*        responsive: true,*/}
                                {/*        maintainAspectRatio: false,*/}
                                {/*        scales: {*/}
                                {/*            r: {*/}
                                {/*                grid: { display: false },     // خطوط شعاعی (دایره‌ها) مخفی شوند*/}
                                {/*                ticks: { display: false },    // اعداد روی شعاع مخفی شوند*/}
                                {/*            },*/}
                                {/*        },*/}
                                {/*        plugins: {*/}
                                {/*            legend: { display: false },*/}
                                {/*            datalabels: {*/}
                                {/*                color: "#ddd",*/}
                                {/*                anchor: "start",      // بیرون slice*/}
                                {/*                align: "end",       // جهت label به بیرون*/}
                                {/*                textAlign:"end",*/}
                                {/*                rotation:5,*/}
                                {/*                offset:180,*/}
                                {/*                font: { size: 12 },*/}

                                {/*                clip: false,*/}
                                {/*                clamp: false,*/}

                                {/*                formatter: (value, context) =>*/}
                                {/*                    context.chart.data.labels?.[context.dataIndex] ?? "",*/}

                                {/*            },*/}
                                {/*        },*/}

                                {/*    }}*/}
                                {/*    style={{ width: "100%", height: "100%" }}*/}
                                {/*/>*/}
                                <PolarArea
                                    data={polarData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            r: {
                                                grid: { display: false },     // خطوط شعاعی (دایره‌ها) مخفی شوند
                                                ticks: { display: false },    // اعداد روی شعاع مخفی شوند
                                            },
                                        },
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: "top",
                                                labels: {
                                                    color: "#ddd",
                                                    usePointStyle: true,
                                                    padding: 16,
                                                },
                                            },
                                            datalabels: {
                                                display: false, // جلوگیری از نمایش داخل slice
                                            },
                                        }


                                    }}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bar Chart */}
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
                                        content={<CustomTooltip />}
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