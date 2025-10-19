import { PENNYLANE_CLIENT_ID, PENNYLANE_CLIENT_SECRET, PENNYLANE_TOKEN_URL } from './config.ts';
import { getClient, saveClient } from './db.ts';
export async function getAccessTokenForClient(clientId: string): Promise<string> {
    const client = getClient(clientId);
    if (!client) {
        throw new Error(`❌ No client found for ID: ${clientId}`);
    }
    const now = Date.now();
    if (client.accessToken && now < client.expiresAt) {
        console.log(`✅ Using cached access token for ${clientId}`);
        return client.accessToken;
    }
    console.log(`🔄 Refreshing access token for ${clientId}...`);
    const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: client.refreshToken,
        client_id: PENNYLANE_CLIENT_ID,
        client_secret: PENNYLANE_CLIENT_SECRET,
    });
    const res = await fetch(PENNYLANE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
    if (!res.ok) {
        const err = await res.text();
        console.error(`❌ Failed to refresh token for ${clientId}:`, err);
        throw new Error(`Token refresh failed for ${clientId}`);
    }
    const data = await res.json();
    console.log(`✅ Token refreshed for ${clientId}, expires in ${data.expires_in}s`);
    saveClient({
        ...client,
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? client.refreshToken,
        expiresAt: now + data.expires_in * 1000,
    });
    return data.access_token;
}
