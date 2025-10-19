import { apiFetch } from './apiClient.ts';
import { log } from './logger.ts';

async function testMeEndpoint() {
    const clientId = 'default';

    log.info('🚀 Testing /me request...');
    const res = await apiFetch(clientId, '/me');
    const data = await res.json();

    log.info('✅ Response from /me:' + data);
}

await testMeEndpoint();

