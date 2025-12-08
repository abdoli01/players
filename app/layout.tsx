import type { Metadata } from "next";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css'
import { vazir } from "./fonts";
import { ReduxProvider } from "@/store/providers";
import { ThemeProvider } from "@/components/ThemeProvider"
import React from "react";
import { NextIntlClientProvider } from 'next-intl';
import requestConfig from '@/src/i18n/request';
import { cookies } from 'next/headers';
import { ToastContainer } from 'react-toastify'

export const metadata: Metadata = {
  title: "Metrica",
  description: "Metrica Application",
};

export default async  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const store =await cookies();
    const locale = store.get('locale')?.value || 'en';
    const { messages } = await requestConfig({ requestLocale: Promise.resolve(locale) });

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'} suppressHydrationWarning  className={locale === "fa" ? vazir.variable : ""}>
      <body
          suppressHydrationWarning
          dir={locale === 'fa' ? 'rtl' : 'ltr'}
          className={`${locale === "fa" ? vazir.variable : ""} antialiased`}
      >
      <NextIntlClientProvider locale={locale} messages={messages}>
      <ReduxProvider>
          <ToastContainer position="top-right" rtl={locale === 'fa'} />
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
          >
          {children}
          </ThemeProvider>
      </ReduxProvider>
      </NextIntlClientProvider>
      </body>
    </html>
  );
}

