import { LoggedError } from './LoggedError.ts';
import * as path from 'jsr:@std/path';
import { log } from './logger.ts';

export interface ConfigFile {
    PENNYLANE_CLIENT_ID: string;
    PENNYLANE_CLIENT_SECRET: string;
    PENNYLANE_REFRESH_TOKEN: string;
}

export const TOKEN_FILE = path.join(Deno.cwd(), 'client_token.json');
export const LOG_FILE = path.join(Deno.cwd(), 'app.log');
export const PENNYLANE_TOKEN_URL = 'https://app.pennylane.com/oauth/token';
export const PENNYLANE_API_URL = 'https://app.pennylane.com/api/external/v2';

const configFile: ConfigFile = await readConfigFile(TOKEN_FILE);
checkConfigFile(configFile);
export const PENNYLANE_CLIENT_ID = configFile.PENNYLANE_CLIENT_ID;
export const PENNYLANE_CLIENT_SECRET = configFile.PENNYLANE_CLIENT_SECRET;
export const PENNYLANE_REFRESH_TOKEN = configFile.PENNYLANE_REFRESH_TOKEN;

function checkConfigFile(configFile: ConfigFile) {
    const PENNYLANE_CLIENT_ID = configFile.PENNYLANE_CLIENT_ID;
    const PENNYLANE_CLIENT_SECRET = configFile.PENNYLANE_CLIENT_SECRET;
    const PENNYLANE_REFRESH_TOKEN = configFile.PENNYLANE_REFRESH_TOKEN;

    const missing = [];

    if (!PENNYLANE_CLIENT_ID)
        missing.push(Object.keys({ PENNYLANE_CLIENT_ID })[0]);
    if (!PENNYLANE_CLIENT_SECRET)
        missing.push(Object.keys({ PENNYLANE_CLIENT_SECRET })[0]);
    if (!PENNYLANE_REFRESH_TOKEN)
        missing.push(Object.keys({ PENNYLANE_REFRESH_TOKEN })[0]);

    if (missing.length) {
        const errorMsg = `${missing.join(' ')} manquants dans le fichier de configuration.`;
        log.error(errorMsg);
        Deno.exit(1);
    }
}

async function readConfigFile(path: string): Promise<ConfigFile> {
    try {
        const data = await Deno.readTextFile(path);
        return JSON.parse(data);
    } catch (err) {
        let errorMsg =
            'Erreur lors de la lecture du fichier de configuration... ';

        if (err instanceof Error && !(err instanceof LoggedError))
            errorMsg += err.message;

        log.error(errorMsg);
        Deno.exit(1);
    }
}
