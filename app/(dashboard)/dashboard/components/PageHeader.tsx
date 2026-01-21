import { useLocale, useTranslations } from "next-intl";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    const t = useTranslations();
    const locale = useLocale();

    const headerText =
        locale === "fa"
            ? `${t('Dashboard.management')} ${title}` // فارسی: مدیریت کاربران
            : `${title} ${t('Dashboard.management')}`; // انگلیسی: Users Management

    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-xl font-semibold">{headerText}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}
