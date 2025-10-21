import { apiFetch } from './apiClient.ts';
import { log } from './logger.ts';

export async function testMeEndpoint() {
    log.info('Test de la requête /me...');

    const res = await apiFetch('/me');
    const data = await res.json();

    log.info('Réponse de /me : ' + JSON.stringify(data));
}
