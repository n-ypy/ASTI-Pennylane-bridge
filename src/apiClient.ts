import { PENNYLANE_API_URL } from './config.ts';
import { LoggedError } from './LoggedError.ts';
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

    let body = '';

    if (res.body) {
        try {
            const jsonBody = await res.clone().json();
            body = JSON.stringify(jsonBody);
        } catch (err) {
            let errorMsg = 'Lecture du body de la requête en échec. ';

            if (err instanceof Error && !(err instanceof LoggedError))
                errorMsg += err.message;

            log.warn(errorMsg);
        }
    }

    log.info(`📡 Requête réponse: ${res.status} ${res.statusText} ${body}`);

    return res;
}
