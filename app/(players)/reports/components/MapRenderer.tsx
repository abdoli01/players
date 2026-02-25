
"use client";

import React from "react";
import SoccerLineUp from "react-soccer-lineup";

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

            <div className="relative w-full overflow-hidden">

                {/* زمین فوتبال */}
                <SoccerLineUp
                    size="responsive"
                    color="000"
                    pattern="lines"
                />

                {/* Heatmap روی خود زمین، از مرز خطوط شروع */}
                <div className="absolute top-0 left-0 p-[22px] w-full h-full" style={{ display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', gridTemplateColumns: 'repeat(6, 1fr)' }}>
                    {map.value.map((cell, idx) => {
                        const intensity = cell.value / maxValue;
                        return (
                            <div
                                key={idx}
                                className="flex items-center justify-center text-xs font-semibold text-white"
                                style={{
                                    backgroundColor: `rgba(255,0,0,${0.15 + intensity * 0.65})`,
                                    width: '100%',
                                    height: '100%',
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