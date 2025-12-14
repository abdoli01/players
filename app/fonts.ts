// app/fonts.ts
import localFont from "next/font/local";


export const vazir = localFont({
    src: [
        { path: "../public/fonts/vazir/Vazir-Regular-FD.woff2", weight: "400" },
        { path: "../public/fonts/vazir/Vazir-Regular-FD.woff", weight: "400" },
    ],
    variable: "--font-vazir",
});

export const ubunto = localFont({
    src: [
        { path: "../public/fonts/ubunto/Ubuntu-R.ttf", weight: "400" }
    ],
    variable: "--font-ubunto",
});

