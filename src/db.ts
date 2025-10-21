import {
    ConfigFile,
    PENNYLANE_CLIENT_ID,
    PENNYLANE_CLIENT_SECRET,
    PENNYLANE_REFRESH_TOKEN,
    TOKEN_FILE,
} from './config.ts';
import { log } from './logger.ts';

interface ClientToken {
    id: string;
    secret: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

const client: ClientToken = {
    id: PENNYLANE_CLIENT_ID,
    secret: PENNYLANE_CLIENT_SECRET,
    accessToken: '',
    refreshToken: PENNYLANE_REFRESH_TOKEN,
    expiresAt: 0,
};

export function getClient(): ClientToken {
    return client;
}

export async function saveClient(token: ClientToken) {
    client.id = token.id;
    client.secret = token.secret;
    client.accessToken = token.accessToken;
    client.refreshToken = token.refreshToken;
    client.expiresAt = token.expiresAt;
    log.info(`Sauvegarde du jeton pour client: ${token.id}`);

    const configFile: ConfigFile = {
        PENNYLANE_CLIENT_ID: token.id,
        PENNYLANE_CLIENT_SECRET: token.secret,
        PENNYLANE_REFRESH_TOKEN: token.refreshToken,
    };

    await Deno.writeTextFile(TOKEN_FILE, JSON.stringify(configFile, null, 2));
}
