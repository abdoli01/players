import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReduxProvider } from "@/store/providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import { vazir } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
    return [{ locale: 'fa' }, { locale: 'en' }];
}

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const locale = params.locale;

    let messages;
    try {
        messages = (await import(`../messages/${locale}.json`)).default;
    } catch {
        notFound();
    }

    return (
        <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
        <body className={`${vazir.variable} antialiased`}>
        <ReduxProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </ThemeProvider>
        </ReduxProvider>
        </body>
        </html>
    );
}
