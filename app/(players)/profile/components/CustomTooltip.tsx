import { TooltipProps } from "recharts";

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-background rounded-md px-3 py-1 text-sm text-foreground">
            {label}: <span className="text-lime-400 font-semibold">{payload[0].value}</span>
        </div>
    );
};

export default CustomTooltip;
