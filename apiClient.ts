import { PENNYLANE_API_URL } from './config.ts';
import { getAccessTokenForClient } from './tokenService.ts';
export async function apiFetch(
    clientId: string,
    path: string,
    init: RequestInit = {},
) {
    const token = await getAccessTokenForClient(clientId);
    const url = path.startsWith('http') ? path : `${PENNYLANE_API_URL}${path}`;
    console.log(`🌍 [${clientId}] → ${init.method ?? 'GET'} ${url}`);
    const res = await fetch(url, {
        ...init,
        headers: {
            ...(init.headers ?? {}),
            'Authorization': `Bearer ${token}`,
        },
    });
    console.log(`📡 [${clientId}] ← ${res.status} ${res.statusText}`);
    return res;
}
