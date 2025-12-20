"use client";
import { useGetPostsQuery } from "@/services/api/postsApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Posts() {
    const { data: posts, isLoading, error } = useGetPostsQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    if (isLoading) return <p>Loading posts...</p>;
    if (error) return <p>Error loading posts</p>;

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
