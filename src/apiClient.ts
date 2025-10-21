import { PENNYLANE_API_URL } from './config.ts';
import { log } from './logger.ts';
import { getAccessToken } from './tokenService.ts';

export async function apiFetch(path: string, init: RequestInit = {}) {
    const token = await getAccessToken();

    const url = path.startsWith('http') ? path : `${PENNYLANE_API_URL}${path}`;

    log.info(`🌍 Requête: ${init.method ?? 'GET'} ${url}`);

    const res = await fetch(url, {
        ...init,
        headers: {
            ...(init.headers ?? {}),
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    log.info(`📡 Requête réponse: ${res.status} ${res.statusText}`);

    return res;
}
