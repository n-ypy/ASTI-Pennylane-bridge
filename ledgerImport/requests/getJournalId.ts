import { LoggedError } from '../../src/LoggedError.ts';
import { apiFetch } from '../../src/apiClient.ts';

/**
 * Cherche un journal via son code
 */
export async function getJournalId(code: string): Promise<number> {
    const res = await apiFetch('/journals?per_page=100');
    const data = await res.json();

    const journal = data.items.find((j: any) => j.code === code);
    if (!journal) {
        throw new LoggedError(`Journal ${code} introuvable`);
    }

    return journal.id;
}
