'use client'

import { Button } from "@/components/ui/button";
import { Video, Minus, SquareCheck } from "lucide-react";

interface VideoCardProps {
    checked?: boolean;
    onCheck?: () => void;
    title?: string;
    code?: string;
    onPlay?: () => void;
    onRemove?: () => void;
}

export function VideoCard({
                              checked = false,
                              onCheck = () => {},
                              title = "OPEN PLAY ATTACK",
                              code = "5-PRS-EST",
                              onPlay = () => {},
                              onRemove = () => {}
                          }: VideoCardProps) {
    return (
        <div className="flex items-center justify-between bg-[#1a1a1a] border border-neutral-700 px-4 py-2 rounded-md shadow w-full">

            {/* Title */}
            <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">{title}</span>
                <span className="text-white/50 text-xs">{code}</span>
            </div>

            <div className="flex items-center justify-center">
                {/* Remove */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="w-8 h-8 hover:bg-transparent transition-transform duration-200 hover:scale-110"
                >
                    <Minus size={20} className="text-white fill-white" />
                </Button>

                {/* Play */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPlay}
                    className="w-8 h-8 hover:bg-transparent transition-transform duration-200 hover:scale-110"
                >
                    <Video size={20} className="text-white fill-white" />
                </Button>

                {/* Check */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCheck}
                    className={`w-8 h-8 flex items-center justify-center hover:bg-transparent transition-transform duration-200 hover:scale-110
                    ${checked ? "border-2 border-green-500 rounded-full" : ""}`}
                >
                    <SquareCheck
                        size={20}
                        className={`text-white ${checked ? "stroke-green-500" : ""}`}
                    />
                </Button>

            </div>


        </div>
    );
}
