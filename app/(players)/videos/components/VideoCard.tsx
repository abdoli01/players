'use client'
import { Button } from "@/components/ui/button";
import { Video, Minus } from "lucide-react";

interface VideoCardProps {
    checked?: boolean;
    onCheck?: () => void;
    title?: string;
    code?: string;
    onPlay?: () => void;
    onRemove?: () => void;
}

export function VideoCard({
                              checked = true,
                              onCheck = () => {},
                              title = "OPEN PLAY ATTACK",
                              code = "5-PRS-EST",
                              onPlay = () => {},
                              onRemove = () => {}
                          }: VideoCardProps) {

    return (
        <div className="flex items-center gap-16 bg-[#1a1a1a] border border-neutral-700 px-4 py-2 rounded-md shadow w-fit">

            <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">{title}</span>
                <span className="text-white/50 text-xs">{code}</span>
            </div>
            <div className='flex items-center justify-center'>
                {/* Remove Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="text-white/70 hover:text-red-400 hover:bg-transparent"
                >
                    <Minus size={18} />
                </Button>
                {/* Play Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPlay}
                    className="text-white/80 hover:text-white hover:bg-transparent"
                >
                    <Video size={18} />
                </Button>
                {/* Normal HTML Checkbox */}
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onCheck}
                    className="w-4 h-4 cursor-pointer accent-white"
                />
            </div>
        </div>
    );
}
