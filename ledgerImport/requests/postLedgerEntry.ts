import { apiFetch } from '../../src/apiClient.ts';
import { log } from '../../src/logger.ts';
import { LedgerEntry } from '../main.ts';

export interface LedgerEntryLine {
    ledger_account_id: number;
    label: string;
    debit: string;
    credit: string;
}

/**
 * Crée une écriture comptable
 */
export async function postLedgerEntry(ledgerEntry: LedgerEntry) {
    const jsonBody = JSON.stringify(ledgerEntry);

    const res = await apiFetch('/ledger_entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonBody,
    });

    if (!res.ok) {
        let errorDetails = '';
        try {
            const errorData = await res.json();
            errorDetails =
                errorData.message ||
                errorData.error ||
                JSON.stringify(errorData);
        } catch (e) {
            errorDetails = "Détails d'erreur non disponibles dans la réponse.";
        }

        log.error(
            `Échec de la création de l'écriture comptable. | STATUT: ${res.status} ${res.statusText} | DÉTAILS API: ${errorDetails} | CONTEXTE: Journal ${ledgerEntry.journal_id}, Libellé "${ledgerEntry.label}" |`,
        );

        return;
    }
    const data = await res.json();
    log.info(
        `✅ Écriture créée #${data.id} (${data.piece_number}): ${data.label}`,
    );
}
