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
    const penaltyArcRadius = 9.15;

    const rows = 5;
    const cols = 6;

    return (
        <div className="w-full space-y-3">
            <h3 className="text-lg font-semibold">{map.title}</h3>

            <div className="w-full" style={{ position: "relative", paddingTop: "61.9%" }}>
                {/* نسبت pitchWidth/pitchLength = 68/105 ≈ 0.619 */}
                <svg
                    viewBox={`0 0 ${pitchLength} ${pitchWidth}`}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                >
                    {/* Grass */}
                    <rect width={pitchLength} height={pitchWidth} fill="#2E7D32" />

                    {/* Outer boundary */}
                    <rect x={0} y={0} width={pitchLength} height={pitchWidth} fill="none" stroke="#fff" strokeWidth={0.5} />

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

                    {/* Penalty arcs */}
            {/*        <path*/}
            {/*            d={`*/}
            {/*  M ${penaltyDepth},${(pitchWidth - 18.3) / 2}*/}
            {/*  A ${penaltyArcRadius} ${penaltyArcRadius} 0 0 1 ${penaltyDepth},${(pitchWidth + 18.3) / 2}*/}
            {/*`}*/}
            {/*            fill="none"*/}
            {/*            stroke="#fff"*/}
            {/*            strokeWidth={0.5}*/}
            {/*        />*/}
            {/*        <path*/}
            {/*            d={`*/}
            {/*  M ${pitchLength - penaltyDepth},${(pitchWidth - 18.3) / 2}*/}
            {/*  A ${penaltyArcRadius} ${penaltyArcRadius} 0 0 0 ${pitchLength - penaltyDepth},${(pitchWidth + 18.3) / 2}*/}
            {/*`}*/}
            {/*            fill="none"*/}
            {/*            stroke="#fff"*/}
            {/*            strokeWidth={0.5}*/}
            {/*        />*/}

                    {/* Heatmap grid */}
                    {/* Heatmap grid */}
                    {map.value.map((cell, idx) => {
                        const row = Math.floor(idx / cols);
                        const col = idx % cols;
                        const intensity = cell.value / maxValue;

                        const x = (col * pitchLength) / cols;
                        const y = (row * pitchWidth) / rows;
                        const cellWidth = pitchLength / cols;
                        const cellHeight = pitchWidth / rows;

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
                                    fontSize={2.5} // می‌تونید سایز فونت رو تنظیم کنید
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