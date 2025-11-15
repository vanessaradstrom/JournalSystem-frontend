// src/api/client.js
const API_BASE_URL = "/api";

export async function apiFetch(path, options = {}, token) {
    const url = `${API_BASE_URL}${path}`;

    const headers = {
        ...(options.headers || {}),
    };

    // Sätt JSON Content-Type om vi skickar JSON‑body
    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorText = "";
        try {
            errorText = await response.text();
        } catch {
            // ignore
        }
        throw new Error(
            errorText || `Request failed: ${response.status} ${response.statusText}`
        );
    }

    // 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
}
