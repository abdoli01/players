// app/fonts.ts
import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const vazir = localFont({
    src: [
        { path: "../public/fonts/vazir/Vazir-Regular-FD.woff2", weight: "400" },
        { path: "../public/fonts/vazir/Vazir-Regular-FD.woff", weight: "400" },
    ],
    variable: "--font-vazir",
});

export const inter = Inter({
    variable: '--font-inter',
    weight: ['400'],
});
