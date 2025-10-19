export const PENNYLANE_TOKEN_URL = 'https://app.pennylane.com/oauth/oauth/token';
export const PENNYLANE_API_URL = 'https://app.pennylane.com/api/external/v2';
export const PENNYLANE_CLIENT_ID = Deno.env.get('PENNYLANE_CLIENT_ID')!;
export const PENNYLANE_CLIENT_SECRET = Deno.env.get('PENNYLANE_CLIENT_SECRET')!;
export const PENNYLANE_REFRESH_TOKEN = Deno.env.get('PENNYLANE_REFRESH_TOKEN') ?? null;
if (!PENNYLANE_REFRESH_TOKEN) {
    throw new Error('❌ Missing PENNYLANE_REFRESH_TOKEN in .env');
}
