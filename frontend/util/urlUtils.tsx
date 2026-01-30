export const BACKEND_API = "http://localhost:8080"

// lib/urlUtils.ts or utils/navigation.ts
export function updateSearchParams(
    pathname: string,
    searchParams: URLSearchParams,
    key: string,
    value: string
): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    return `${pathname}?${params.toString()}`;
}