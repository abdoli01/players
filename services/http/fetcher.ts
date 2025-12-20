const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetcher<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        ...options,
    });

    if (!res.ok) {
        const error = await res.json();
        throw error;
    }

    return res.json();
}
