import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/src/i18n/routing';
import {setRequestLocale} from 'next-intl/server';
type Props = {
    children: React.ReactNode;
    params: Promise<{locale: string}>;
};

export default async function LocaleLayout({children, params}: Props) {
    // Ensure that the incoming `locale` is valid
    const {locale} = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    const messages =
        (await import(`../../messages/${locale}.json`)).default;
    // try {
    //     const messages = (await import(`../../messages/${locale}.json`)).default;
    //     console.log("messages loaded OK");
    // } catch(err) {
    //     console.error("FAILED TO LOAD MESSAGES:", err);
    // }
    // console.log("Loaded messages:", messages);
    setRequestLocale(locale);
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );

    // ...
}