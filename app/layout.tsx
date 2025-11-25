import type { Metadata } from "next";
import "./globals.css";
import { vazir } from "./fonts";
import { ReduxProvider } from "@/store/providers";
import { ThemeProvider } from "@/components/ThemeProvider"
import React from "react";


export const metadata: Metadata = {
  title: "Metrica",
  description: "Metrica Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
          className={`${vazir.variable} antialiased`}
      >
      <ReduxProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
          {children}
          </ThemeProvider>
      </ReduxProvider>
      </body>
    </html>
  );
}

