import type { Metadata } from "next";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css'
import { vazir,ubunto } from "./fonts";
import { ReduxProvider } from "@/store/providers";
import { ThemeProvider } from "@/components/ThemeProvider"
import React from "react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
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

    const locale = await getLocale();
    const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'} suppressHydrationWarning  className={locale === "fa" ? vazir.variable : ubunto.variable}>
      <body
          suppressHydrationWarning
          dir={locale === 'fa' ? 'rtl' : 'ltr'}
          className={`${locale === "fa" ? vazir.variable : ubunto.variable} antialiased`}
      >
      <NextIntlClientProvider locale={locale} messages={messages}>
      <ReduxProvider>
          <ToastContainer position="top-right" autoClose={5000} pauseOnHover  hideProgressBar={false} rtl={locale === 'fa'} />
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

