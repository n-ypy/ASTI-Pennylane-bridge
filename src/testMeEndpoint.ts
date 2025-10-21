import { apiFetch } from './apiClient.ts';
import { log } from './logger.ts';

export async function testMeEndpoint() {
    log.info('Test de la requête /me...');

    await apiFetch('/me');
}
