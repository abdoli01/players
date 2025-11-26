import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {setRequestLocale} from 'next-intl/server';

export default async function LocaleLayout({children, params}: {children: React.ReactNode, params: any}) {
    // اگر params Promise باشه:
    const resolvedParams = await params;
    const { locale } = resolvedParams;

    console.log('locale locale', locale);

    if (!hasLocale(routing.locales, locale)) notFound();
    setRequestLocale(locale);

    const messages = (await import(`@/messages/${locale}.json`)).default;
    console.log('333', messages);

    return (
        <div dir={locale === 'fa' ? 'rtl' : 'ltr'} lang={locale}>
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
        </div>

    );
}

