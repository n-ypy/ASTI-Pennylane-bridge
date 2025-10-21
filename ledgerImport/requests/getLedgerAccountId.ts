import { apiFetch } from '../../src/apiClient.ts';
import { LoggedError } from '../../src/LoggedError.ts';

/**
 * Cherche un compte comptable via son numéro
 */
export async function getLedgerAccountId(
    accountNumber: string,
): Promise<number> {
    const url = `/ledger_accounts?filter=[{"field":"number","operator":"eq","value":"${accountNumber}"}]`;

    const res = await apiFetch(url);
    const data = await res.json();

    if (!data.items?.length) {
        throw new LoggedError(`Compte comptable ${accountNumber} introuvable`);
    }

    return data.items[0].id;
}
