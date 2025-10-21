import { PENNYLANE_TOKEN_URL } from './config.ts';
import { getClient, saveClient } from './db.ts';
import { LoggedError } from './LoggedError.ts';
import { log } from './logger.ts';

export async function getAccessToken(): Promise<string> {
    log.info("Récupération du jeton d'accès...");

    const client = getClient();
    if (!client) {
        throw new LoggedError(`Pas de client trouvé :${client}`);
    }

    const now = Date.now();
    if (client.accessToken && now < client.expiresAt) {
        log.info(`Utilisation du jeton d'accès mis en cache pour ${client.id}`);
        return client.accessToken;
    }

    log.info(`Actualisation du jeton d'accès pour ${client.id}...`);
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: client.refreshToken,
        client_id: client.id,
        client_secret: client.secret,
    });
    const res = await fetch(PENNYLANE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
    if (!res.ok) {
        const err = await res.text();
        throw new LoggedError(
            `Échec de l'actualisation du jeton pour ${client.id}: ${res.status} ${res.statusText} ${err}`,
        );
    }
    const data = await res.json();
    log.info(
        `Jeton actualisé pour ${client.id}, expire dans ${data.expires_in}s`,
    );

    saveClient({
        ...client,
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? client.refreshToken,
        expiresAt: now + data.expires_in * 1000,
    });

    return data.access_token;
}
