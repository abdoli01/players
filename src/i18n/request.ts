// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
    const store = await cookies();
    const locale = store.get('locale')?.value || 'en'; // زبان پیش‌فرض en

    return {
        locale,
        messages: (await import(`../../messages/${locale}`)).default
    };
});
