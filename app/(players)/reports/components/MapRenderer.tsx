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

const MapRenderer: React.FC<Props> = ({ map }) => {
    if (!map?.value?.length) return null;

    const maxValue = Math.max(...map.value.map((r) => r.value));

    return (
        <div className="space-y-3 w-full">
            <h3 className="text-lg font-semibold">{map.title}</h3>

            {/* Pitch */}
            <div className="relative w-full h-[400px] rounded-xl overflow-hidden border">

                {/* Grass */}
                <div className="absolute inset-0 bg-green-700" />

                {/* Pitch lines */}
                <svg
                    viewBox="0 0 150 100"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                >
                    <rect x="1" y="1" width="148" height="98" fill="none" stroke="white" strokeWidth="1" />
                    <line x1="75" y1="0" x2="75" y2="100" stroke="white" strokeWidth="1" />
                    <circle cx="75" cy="50" r="12" fill="none" stroke="white" strokeWidth="1" />

                    {/* penalty areas */}
                    <rect x="1" y="25" width="20" height="50" fill="none" stroke="white" strokeWidth="1"/>
                    <rect x="129" y="25" width="20" height="50" fill="none" stroke="white" strokeWidth="1"/>

                    {/* goal areas */}
                    <rect x="1" y="38" width="8" height="24" fill="none" stroke="white" strokeWidth="1"/>
                    <rect x="141" y="38" width="8" height="24" fill="none" stroke="white" strokeWidth="1"/>
                </svg>

                {/* 6 x 5 Heatmap Grid */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-5">
                    {map.value.map((cell) => {
                        const intensity = cell.value / maxValue;

                        return (
                            <div
                                key={cell.row}
                                className="flex items-center justify-center text-xs font-semibold text-white"
                                style={{
                                    backgroundColor: `rgba(255,0,0,${0.15 + intensity * 0.65})`,
                                }}
                            >
                                {cell.value}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MapRenderer;