const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function fetcher<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        ...options,
    });

    const data = await res.json();

    if (!res.ok) {
        throw { ...data, status: res.status }; // ✅ ارسال status
    }

    return data;
}
