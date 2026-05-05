"use client";

import React from "react";

interface MapRow {
    row: number;
    value: number;
    grade: string;
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

    // ===== Pitch =====
    const pitchLength = 105;
    const pitchWidth = 68;

    const penaltyDepth = 16.5;
    const penaltyWidth = 40.3;
    const goalDepth = 5.5;
    const goalWidth = 18.3;
    const centerCircleRadius = 9.15;

    const cols = 6;
    const rows = 5;

    const yBorders = [
        0,
        (pitchWidth - penaltyWidth) / 2,
        (pitchWidth - goalWidth) / 2,
        (pitchWidth + goalWidth) / 2,
        (pitchWidth + penaltyWidth) / 2,
        pitchWidth,
    ];

    const getGradeClass = (grade: string) => {
        switch (grade) {
            case "A":
                return "fill-h1";
            case "B":
                return "fill-h2";
            case "C":
                return "fill-hg3";
            case "D":
                return "fill-hg4";
            default:
                return "fill-transparent";
        }
    };

    const totalCells = map.value.length;
    const compactMode = totalCells <= 15;

    // =========================
    // usable area (2/3 right side)
    // =========================
    const usableWidth = compactMode
        ? (pitchLength * 2) / 3
        : pitchLength;

    const xOffset = compactMode
        ? pitchLength / 3
        : 0;

    // تعداد ستون واقعی
    const activeCols = Math.ceil(totalCells / rows);

    const cellWidth = usableWidth / activeCols;

    return (
        <div className="w-full space-y-3">
            <h3 className="text-lg font-semibold">{map.title}</h3>

            <div className="w-full relative" style={{ paddingTop: "61.9%" }}>
                <svg
                    viewBox={`0 0 ${pitchLength} ${pitchWidth}`}
                    className="absolute top-0 left-0 w-full h-full"
                >
                    {/* Grass */}
                    <rect width={pitchLength} height={pitchWidth} fill="#2E7D32" />

                    {/* Border */}
                    <rect
                        x={0}
                        y={0}
                        width={pitchLength}
                        height={pitchWidth}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={0.5}
                    />

                    {/* Mid line */}
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

                    {/* ===================== HEATMAP ===================== */}
                    {map.value.map((cell, idx) => {
                        const baseCol = Math.floor(idx / rows);
                        const row = idx % rows;

                        // از راست به چپ در compact
                        const col = compactMode
                            ? activeCols - 1 - baseCol
                            : baseCol;

                        const x = xOffset + col * cellWidth;
                        const y = yBorders[row];

                        const cellHeight = yBorders[row + 1] - y;

                        const gap = 0.7;

                        return (
                            <g key={idx}>
                                <rect
                                    x={x + gap / 2}
                                    y={y + gap / 2}
                                    width={cellWidth - gap}
                                    height={cellHeight - gap}
                                    className={getGradeClass(cell.grade)}
                                    opacity={0.5}
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