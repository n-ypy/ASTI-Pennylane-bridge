import { PENNYLANE_REFRESH_TOKEN } from './config.ts';
interface ClientToken {
    id: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}
const clients = new Map<string, ClientToken>();
// Initialize with default "system" client
if (PENNYLANE_REFRESH_TOKEN) {
    clients.set('default', {
        id: 'default',
        accessToken: '',
        refreshToken: PENNYLANE_REFRESH_TOKEN,
        expiresAt: 0,
    });
}
export function getClient(id: string): ClientToken | undefined {
    return clients.get(id);
}
export function saveClient(token: ClientToken) {
    console.log(`💾 Saving client token for ${token.id}`);
    clients.set(token.id, token);
}
