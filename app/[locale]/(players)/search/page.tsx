"use client";
import { useTranslations } from 'next-intl';
import { useGetPostsQuery } from "@/services/postsApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Posts() {
    const t = useTranslations();
    const { data: posts, isLoading, error } = useGetPostsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    if (isLoading) return <p>{t('common.loading')}</p>;
    if (error) return <p>{t('common.error')}</p>;

    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts?.map((post) => (
                <Card key={post.id} className="bg-background text-foreground">
                    <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{post.body}</CardDescription>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
