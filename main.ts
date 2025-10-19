import { apiFetch } from './apiClient.ts';

async function testMeEndpoint() {
    const clientId = 'default';

    console.log('🚀 Testing /me request...');
    const res = await apiFetch(clientId, '/me');
    const data = await res.json();

    console.log('✅ Response from /me:', data);
}

await testMeEndpoint();
