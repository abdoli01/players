"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";

interface MatchCardProps {
    homeTeam?: {
        name: string;
        logo?: string;
    };
    awayTeam?: {
        name: string;
        logo?: string;
    };

    homeScore?: number;
    awayScore?: number;

    tournament?: string;
    round?: string;
    stadium?: string;
    date?: string;

    firstChecked?: boolean;
    secondChecked?: boolean;

    onFirstCheckedChange?: (checked: boolean) => void;
    onSecondCheckedChange?: (checked: boolean) => void;
}

export default function MatchCard({
                                      homeTeam = {
                                          name: "Persepolis",
                                      },
                                      awayTeam = {
                                          name: "Tractor",
                                      },

                                      homeScore = 1,
                                      awayScore = 1,

                                      tournament = "Tournament",
                                      round = "Round",
                                      stadium = "Stadium",
                                      date = "Date",

                                      firstChecked = false,
                                      secondChecked = false,

                                      onFirstCheckedChange,
                                      onSecondCheckedChange,
                                  }: MatchCardProps) {
    return (
        <Card className="w-full rounded-xl bg-zinc-800 border-zinc-700 p-3 text-white gap-2">
            {/* Teams */}
            <div className="flex items-center justify-between gap-3">

                {/* Home Logo */}
                <div className="shrink-0">
                    {homeTeam.logo ? (
                        <Image
                            src={homeTeam.logo}
                            alt={homeTeam.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover border border-zinc-500"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full border border-zinc-500" />
                    )}
                </div>

                {/* Center */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-3">
            <span className="font-semibold text-sm">
                {homeTeam.name}
            </span>

                        <span className="text-xl font-bold whitespace-nowrap">
                {homeScore} - {awayScore}
            </span>

                        <span className="font-semibold text-sm">
                {awayTeam.name}
            </span>
                    </div>

                    <div className="text-[11px] text-zinc-400 text-center mt-1">
                        {tournament}، {round}، {stadium}، {date}
                    </div>
                </div>

                {/* Away Logo */}
                <div className="shrink-0">
                    {awayTeam.logo ? (
                        <Image
                            src={awayTeam.logo}
                            alt={awayTeam.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover border border-zinc-500"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full border border-zinc-500" />
                    )}
                </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex justify-center gap-2">
                <button
                    type="button"
                    onClick={() =>
                        onFirstCheckedChange?.(!firstChecked)
                    }
                    className={`
                        w-5 h-5
                        rounded-[6px]
                        border-2
                        transition-all
                        duration-200
                        ${
                        firstChecked
                            ? "bg-orange-500 border-orange-500"
                            : "border-orange-400 bg-transparent hover:bg-orange-500/10"
                    }
                    `}
                />

                <button
                    type="button"
                    onClick={() =>
                        onSecondCheckedChange?.(!secondChecked)
                    }
                    className={`
                        w-5 h-5
                        rounded-[6px]
                        border-2
                        transition-all
                        duration-200
                        ${
                        secondChecked
                            ? "bg-orange-500 border-orange-500"
                            : "border-orange-400 bg-transparent hover:bg-orange-500/10"
                    }
                    `}
                />
            </div>
        </Card>
    );
}