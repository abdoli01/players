'use client';

import { TooltipProps } from "recharts";

interface PieData {
    name: string;
    value: number;
}

const PieTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload as { name: string; value: number };

    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1 text-sm text-white shadow-lg">
            {data.name}: <span className="text-lime-400 font-semibold">{data.value}</span>
        </div>
    );
};


export default PieTooltip;
