'use client'

import { Button } from "@/components/ui/button";
import { Video, Minus, SquareCheck } from "lucide-react";

interface VideoCardProps {
    checked?: boolean; // ✅ اضافcه شد
    onCheck?: () => void; // ✅ اضافه شد
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
        <div className="flex items-center justify-between bg-card px-4 py-2 mb-1 shadow w-full rounded-md">

            {/* Title */}
            <div className="flex flex-col">
                <span className="text-foreground font-semibold text-sm">{title}</span>
                <span className="text-foreground/50 text-xs">{code}</span>
            </div>

            <div className="flex items-center justify-center">
                {/* Remove */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="w-8 h-8 hover:bg-app-orange transition-transform duration-200 hover:scale-110 cursor-pointer"
                >
                    <Minus size={20} className="text-foreground fill-white" />
                </Button>

                {/* Play */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPlay}
                    className="w-8 h-8 hover:bg-app-orange transition-transform duration-200 hover:scale-110 cursor-pointer"
                >
                    <Video size={20} className="text-foreground fill-white" />
                </Button>

                {/* Check */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCheck} // ✅ استفاده ازرززبزز prop
                    className={`w-8 h-8 flex items-center justify-center hover:bg-app-orange transition-transform duration-200 hover:scale-110 cursor-pointer
                    ${checked ? "border-2 border-app-orange rounded-full" : ""}`} // ✅ تغییر استایل بر اساس checked
                >
                    <SquareCheck
                        size={20}
                        className={`text-foreground ${checked ? "stroke-app-orange" : ""}`} // ✅ تغییر رنگ آیکون
                    />
                </Button>


            </div>


        </div>
    );
}
