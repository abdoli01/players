"use client"

type Player = {
    id: number
    number: number
    top: string
    left: string
}

const startingXI: Player[] = [
    { id: 1, number: 1, top: "50%", left: "7%" },

    { id: 2, number: 4, top: "18%", left: "30%" },
    { id: 3, number: 5, top: "32%", left: "30%" },
    { id: 4, number: 6, top: "55%", left: "30%" },
    { id: 5, number: 3, top: "72%", left: "30%" },

    { id: 6, number: 7, top: "45%", left: "50%" },
    { id: 7, number: 10, top: "55%", left: "50%" },

    { id: 8, number: 70, top: "18%", left: "70%" },
    { id: 9, number: 23, top: "32%", left: "82%" },
    { id: 10, number: 9, top: "55%", left: "82%" },
    { id: 11, number: 21, top: "72%", left: "65%" },
]

const substitutes = [77, 8, 2, 11, 69, 93]

export default function FootballPitch() {
    return (
        <div className="bg-black p-6 rounded-xl w-fit">

            {/* FIELD */}
            <div className="relative w-[820px] aspect-[2.25/1] border-2 border-gray-500">

                {/* Inner Border */}
                <div className="absolute inset-4 border border-gray-500" />

                {/* Half Line */}
                <div className="absolute top-4 bottom-4 left-1/2 w-px bg-gray-500" />

                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 w-28 h-28 border border-gray-500 rounded-full -translate-x-1/2 -translate-y-1/2" />

                {/* ---------- LEFT SIDE ---------- */}

                {/* Penalty Area */}
                <div className="absolute top-[18%] left-4 w-40 h-[64%] border border-gray-500" />

                {/* Goal Area */}
                <div className="absolute top-[38%] left-4 w-20 h-[24%] border border-gray-500" />

                {/* Penalty Arc (OUTSIDE only) */}
                <div className="absolute top-1/2 left-[98px] w-28 h-28 border border-gray-500 rounded-full -translate-y-1/2 clip-left" />

                {/* ---------- RIGHT SIDE ---------- */}

                {/* Penalty Area */}
                <div className="absolute top-[18%] right-4 w-40 h-[64%] border border-gray-500" />

                {/* Goal Area */}
                <div className="absolute top-[38%] right-4 w-20 h-[24%] border border-gray-500" />

                {/* Penalty Arc (OUTSIDE only) */}
                <div className="absolute top-1/2 right-[98px] w-28 h-28 border border-gray-500 rounded-full -translate-y-1/2 clip-right" />

                {/* PLAYERS */}
                {startingXI.map(player => (
                    <div
                        key={player.id}
                        className="absolute w-9 h-9 bg-lime-400 rounded-full text-black font-bold text-xs flex items-center justify-center"
                        style={{
                            top: player.top,
                            left: player.left,
                            transform: "translate(-50%, -50%)"
                        }}
                    >
                        {player.number}
                    </div>
                ))}
            </div>

            {/* SUBSTITUTES */}
            <div className="flex gap-2 mt-4">
                {substitutes.map((num, i) => (
                    <div
                        key={i}
                        className="w-9 h-9 bg-lime-400 rounded-full text-black font-bold text-xs flex items-center justify-center"
                    >
                        {num}
                    </div>
                ))}
            </div>

            {/* CLIP HELPERS */}
            <style jsx>{`
        .clip-left {
          clip-path: inset(0 0 0 70%);
        }
        .clip-right {
          clip-path: inset(0 70% 0 0);
        }
      `}</style>
        </div>
    )
}
