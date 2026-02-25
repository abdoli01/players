"use client";

import React from "react";

interface MapRow {
    row: number;
    value: number;
    grade: number;
}

interface MapData {
    title: string;
    key: string;
    value: MapRow[];
}

interface Props {
    map?: MapData;
}

const FootballPitch: React.FC<Props> = ({ map }) => {
    if (!map?.value?.length) return null;

    const maxValue = Math.max(...map.value.map((r) => r.value));

    // استاندارد FIFA (متر)
    const pitchLength = 105;
    const pitchWidth = 68;
    const penaltyDepth = 16.5;
    const penaltyWidth = 40.3;
    const goalDepth = 5.5;
    const goalWidth = 18.3;
    const centerCircleRadius = 9.15;

    const cols = 6;
    const rows = 5;

    // طول هر باکس proportional به زمین (همانند قبل)
    const xBorders = [
        0,
        penaltyDepth,
        penaltyDepth + goalDepth,
        pitchLength / 2,
        pitchLength - (penaltyDepth + goalDepth),
        pitchLength - penaltyDepth,
        pitchLength,
    ];

    // عرض هر باکس proportional به مناطق واقعی
    const yBorders = [
        0,
        (pitchWidth - penaltyWidth) / 2,       // شروع محوطه جریمه
        (pitchWidth - goalWidth) / 2,          // شروع محوطه کوچک
        (pitchWidth + goalWidth) / 2,          // انتهای محوطه کوچک
        (pitchWidth + penaltyWidth) / 2,       // انتهای محوطه جریمه
        pitchWidth                              // خط پایینی زمین
    ];

    return (
        <div className="w-full space-y-3">
            <h3 className="text-lg font-semibold">{map.title}</h3>

            <div className="w-full" style={{ position: "relative", paddingTop: "61.9%" }}>
                <svg
                    viewBox={`0 0 ${pitchLength} ${pitchWidth}`}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                >
                    {/* Grass */}
                    <rect width={pitchLength} height={pitchWidth} fill="#2E7D32" />

                    {/* Outer boundary */}
                    <rect
                        x={0}
                        y={0}
                        width={pitchLength}
                        height={pitchWidth}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={0.5}
                    />

                    {/* Halfway line */}
                    <line
                        x1={pitchLength / 2}
                        y1={0}
                        x2={pitchLength / 2}
                        y2={pitchWidth}
                        stroke="#fff"
                        strokeWidth={0.5}
                    />

                    {/* Center circle */}
                    <circle
                        cx={pitchLength / 2}
                        cy={pitchWidth / 2}
                        r={centerCircleRadius}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={0.5}
                    />
                    <circle cx={pitchLength / 2} cy={pitchWidth / 2} r={0.3} fill="#fff" />

                    {/* Penalty areas */}
                    <rect
                        x={0}
                        y={(pitchWidth - penaltyWidth) / 2}
                        width={penaltyDepth}
                        height={penaltyWidth}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={0.5}
                    />
                    <rect
                        x={pitchLength - penaltyDepth}
                        y={(pitchWidth - penaltyWidth) / 2}
                        width={penaltyDepth}
                        height={penaltyWidth}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={0.5}
                    />

                    {/* Goal areas */}
                    <rect
                        x={0}
                        y={(pitchWidth - goalWidth) / 2}
                        width={goalDepth}
                        height={goalWidth}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={0.5}
                    />
                    <rect
                        x={pitchLength - goalDepth}
                        y={(pitchWidth - goalWidth) / 2}
                        width={goalDepth}
                        height={goalWidth}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={0.5}
                    />

                    {/* Penalty spots */}
                    <circle cx={11} cy={pitchWidth / 2} r={0.3} fill="#fff" />
                    <circle cx={pitchLength - 11} cy={pitchWidth / 2} r={0.3} fill="#fff" />

                    {/* Heatmap grid با عرض واقعی */}
                    {map.value.map((cell, idx) => {
                        const row = Math.floor(idx / cols);
                        const col = idx % cols;

                        const x = xBorders[col];
                        const y = yBorders[row];
                        const cellWidth = xBorders[col + 1] - x;
                        const cellHeight = yBorders[row + 1] - y;

                        const intensity = cell.value / maxValue;

                        return (
                            <g key={idx}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={cellWidth}
                                    height={cellHeight}
                                    fill={`rgba(255,0,0,${0.15 + intensity * 0.65})`}
                                />
                                <text
                                    x={x + cellWidth / 2}
                                    y={y + cellHeight / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={2.5}
                                    fill="#fff"
                                >
                                    {cell.value}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default FootballPitch;