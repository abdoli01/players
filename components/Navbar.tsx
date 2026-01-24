"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {ReactNode} from "react";
import Image from "next/image";
import {cn} from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import {useLocale, useTranslations} from "next-intl";
import {Player} from "@/types/player";

export default function Navbar({children}: { children: ReactNode }) {
    const pathname = usePathname();
    const locale = useLocale();
    const isRtl = locale === "fa";

    const tabs = [
        { title: "profile", url: "/profile" },
        { title: "reports", url: "/reports" },
        { title: "videos", url: "/videos" },
    ];

    const isActive = (url: string) => pathname.startsWith(url);

    const { user } = useAppSelector(
        (state) => state.user
    );
    const player : Player | null = useAppSelector((s) => s.player.player);
    console.log('3333',user)
    console.log('player in navbar',player)
    const t = useTranslations('Navbar');

    return (
        <div className="w-full py-2 md:flex items-end justify-between text-white border-b-2 border-[#2c2c2c]">
            {/* LEFT: Player Info */}
           <div className="flex items-center justify-between">
               <span className="block md:hidden">{children}</span>
               <div className="flex items-center gap-3">
                   <Image src="/images/alipor.png" alt="player"  width={40} height={40} className='rounded-full' />
                   <div className="flex flex-col leading-tight">
                       <span className="font-semibold text-lg text-foreground">{!isRtl ? player?.fullNameEn : player?.fullName}</span>
                       <span className="text-sm text-gray-400">Persepolis | #09 | 29yo</span>
                   </div>
               </div>
               <Link
                   href='/'
                   className={cn(
                       "flex flex-col items-center justify-center gap-2 px-3 py-2 transition-colors h-[65px]",
                   )}
               >
                   <div className="relative w-6 h-8 md:w-12 md:h-14 block md:hidden">
                       <Image
                           src="/images/logo-new.png"
                           alt="logo"
                           fill
                           className="object-contain"
                       />
                   </div>
               </Link>
           </div>

            {/* RIGHT: Tabs */}
            <div className="flex items-center justify-center text-sm font-medium">
                {tabs.map(({ title, url }) => (
                    <Link href={url} key={title} className="relative cursor-pointer">
            <span
                className={

                `${    isActive(url)
                    ? "text-app-orange"
                    : "text-gray-300 hover:text-app-orange transition"} px-8`
                }
            >
                {t(title)}
            </span>

                        {isActive(url) && (
                            <div className="absolute left-0 -bottom-2.5 w-full h-[2px] bg-app-orange rounded-full" />
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
