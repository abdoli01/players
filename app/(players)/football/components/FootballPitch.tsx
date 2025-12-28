'use client'
import React, { useState, useEffect } from 'react';

interface Player {
    id: number;
    number: number;
    position: { x: number; y: number };
    name?: string;
}

interface FootballPitchProps {
    players?: Player[];
    onPlayerClick?: (player: Player) => void;
}

const FootballPitch: React.FC<FootballPitchProps> = ({
                                                         players: initialPlayers,
                                                         onPlayerClick
                                                     }) => {
    // بازیکنان پیش‌فرض از داده‌های شما
    const defaultPlayers: Player[] = [
        { id: 1, number: 7, position: { x: 20, y: 50 } },
        { id: 2, number: 8, position: { x: 35, y: 30 } },
        { id: 3, number: 2, position: { x: 35, y: 70 } },
        { id: 4, number: 11, position: { x: 50, y: 20 } },
        { id: 5, number: 69, position: { x: 50, y: 50 } },
        { id: 6, number: 93, position: { x: 50, y: 80 } },
        { id: 7, number: 4, position: { x: 65, y: 10 } },
        { id: 8, number: 5, position: { x: 65, y: 30 } },
        { id: 9, number: 6, position: { x: 65, y: 70 } },
        { id: 10, number: 8, position: { x: 65, y: 90 } },
        { id: 11, number: 70, position: { x: 80, y: 50 } },
        { id: 12, number: 7, position: { x: 95, y: 30 } },
        { id: 13, number: 0, position: { x: 95, y: 70 } },
        { id: 14, number: 21, position: { x: 85, y: 15 } },
        { id: 15, number: 23, position: { x: 85, y: 85 } },
        { id: 16, number: 9, position: { x: 95, y: 50 } },
    ];

    const [players, setPlayers] = useState<Player[]>(initialPlayers || defaultPlayers);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    // اگر initialPlayers تغییر کرد، state را به روز کن
    useEffect(() => {
        if (initialPlayers) {
            setPlayers(initialPlayers);
        }
    }, [initialPlayers]);

    const handlePlayerClick = (player: Player) => {
        setSelectedPlayer(player);
        if (onPlayerClick) {
            onPlayerClick(player);
        }
    };

    // تابع برای جابجایی بازیکنان (مثال ساده)
    const movePlayer = (playerId: number, newPosition: { x: number; y: number }) => {
        setPlayers(prev => prev.map(p =>
            p.id === playerId ? { ...p, position: newPosition } : p
        ));
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-2 text-green-800">
                    زمین فوتبال ریسپانسیو
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    زمین فوتبال با چیدمان دینامیک بازیکنان - کاملاً واکنشگرا
                </p>

                {/* نمایش بازیکن انتخاب شده */}
                {selectedPlayer && (
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="font-bold text-lg text-gray-800">
                            بازیکن انتخاب شده: شماره {selectedPlayer.number}
                        </h3>
                        <p className="text-gray-600">
                            موقعیت: X: {selectedPlayer.position.x.toFixed(1)}%, Y: {selectedPlayer.position.y.toFixed(1)}%
                        </p>
                        <div className="mt-2 flex space-x-2">
                            <button
                                className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                                onClick={() => movePlayer(selectedPlayer.id, {
                                    x: Math.min(100, selectedPlayer.position.x + 5),
                                    y: selectedPlayer.position.y
                                })}
                            >
                                حرکت به راست
                            </button>
                            <button
                                className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                                onClick={() => movePlayer(selectedPlayer.id, {
                                    x: Math.max(0, selectedPlayer.position.x - 5),
                                    y: selectedPlayer.position.y
                                })}
                            >
                                حرکت به چپ
                            </button>
                        </div>
                    </div>
                )}

                {/* زمین فوتبال */}
                <div className="relative w-full bg-gradient-to-r from-green-700 to-green-600 rounded-3xl overflow-hidden shadow-2xl border-8 border-green-900 mb-8 aspect-[16/9]">

                    {/* خطوط زمین */}
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-white border-opacity-80 rounded-3xl"></div>

                    {/* خط میانی */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-white bg-opacity-80"></div>

                    {/* دایره مرکز */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-4 border-white border-opacity-80 rounded-full"></div>

                    {/* نقطه مرکز */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>

                    /* محوطه جریمه چپ */
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-16 h-48 border-4 border-white border-opacity-80 border-r-0 rounded-l-lg"></div>
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-6 h-24 border-4 border-white border-opacity-80 border-r-0 rounded-l-lg"></div>

                    /* محوطه جریمه راست */
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-16 h-48 border-4 border-white border-opacity-80 border-l-0 rounded-r-lg"></div>
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-6 h-24 border-4 border-white border-opacity-80 border-l-0 rounded-r-lg"></div>

                    /* نقطه پنالتی چپ */
                    <div className="absolute top-1/2 left-12 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>

                    /* نقطه پنالتی راست */
                    <div className="absolute top-1/2 right-12 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>

                    /* دروازه چپ */
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-16 border-4 border-white border-opacity-80 border-r-0"></div>

                    /* دروازه راست */
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-16 border-4 border-white border-opacity-80 border-l-0"></div>

                    {/* نمایش بازیکنان */}
                    {players.map(player => (
                        <div
                            key={player.id}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 ${
                                selectedPlayer?.id === player.id
                                    ? 'bg-blue-600 border-2 border-yellow-400 shadow-lg'
                                    : 'bg-white border-2 border-gray-800 shadow-md'
                            }`}
                            style={{
                                left: `${player.position.x}%`,
                                top: `${player.position.y}%`,
                            }}
                            onClick={() => handlePlayerClick(player)}
                        >
              <span className={`font-bold ${
                  selectedPlayer?.id === player.id ? 'text-white' : 'text-gray-800'
              }`}>
                {player.number}
              </span>
                        </div>
                    ))}
                </div>

                {/* راهنما */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h3 className="font-bold text-lg text-green-700 mb-2">ویژگی‌های زمین</h3>
                        <ul className="text-gray-600 space-y-1">
                            <li>• کاملاً ریسپانسیو و واکنشگرا</li>
                            <li>• طراحی شده با Tailwind CSS</li>
                            <li>• خطوط و نشانه‌های استاندارد</li>
                            <li>• مناسب برای Next.js پروژه</li>
                        </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h3 className="font-bold text-lg text-green-700 mb-2">بازیکنان</h3>
                        <ul className="text-gray-600 space-y-1">
                            <li>• {players.length} بازیکن روی زمین</li>
                            <li>• قابلیت کلیک روی بازیکنان</li>
                            <li>• امکان جابجایی دینامیک</li>
                            <li>• نمایش اطلاعات بازیکن انتخاب شده</li>
                        </ul>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <h3 className="font-bold text-lg text-green-700 mb-2">نحوه استفاده</h3>
                        <ul className="text-gray-600 space-y-1">
                            <li>• روی هر بازیکن کلیک کنید</li>
                            <li>• از دکمه‌ها برای حرکت بازیکن استفاده کنید</li>
                            <li>• برای تغییر چیدمان، players را به کامپوننت پاس دهید</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FootballPitch;