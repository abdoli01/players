// app/fonts.ts
import localFont from "next/font/local";

export const vazir = localFont({
    src: [
        { path: "../public/fonts/vazir/Vazir.woff2", weight: "400" },
        { path: "../public/fonts/vazir/Vazir.woff", weight: "400" },
    ],
    variable: "--font-vazir",
});
