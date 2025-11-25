import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['fa', 'en'] as const;
export const defaultLocale = 'fa' as const;

export type Locale = (typeof locales)[number];

// @ts-ignore
export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as Locale)) {
        notFound();
    }

    return {
        locale,
        messages: (await import(`../app/messages/${locale}.json`)).default
    };
});
