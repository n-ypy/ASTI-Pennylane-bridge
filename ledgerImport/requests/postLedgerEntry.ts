import { apiFetch } from '../../src/apiClient.ts';
import { log } from '../../src/logger.ts';

export interface LedgerEntryLine {
    ledger_account_id: number;
    label: string;
    debit: string;
    credit: string;
}

/**
 * Crée une écriture comptable
 */
export async function postLedgerEntry(
    journalId: number,
    date: string,
    label: string,
    lines: LedgerEntryLine[],
) {
    const bodyData = {
        date,
        label,
        journal_id: journalId,
        ledger_entry_lines: lines,
    };
    const jsonBody = JSON.stringify(bodyData);

    const res = await apiFetch('/ledger_entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonBody,
    });

    const data = await res.json();
    log.info(`✅ Écriture créée #${data.id} : ${label}`);

    return data;
}
