import { log } from '../src/logger.ts';
import {
    LedgerEntryLine,
    postLedgerEntry,
} from './requests/postLedgerEntry.ts';
import { formatDate } from './helpers/formatDate.ts';
import { parseCsv } from './parseLedgerCsv.ts';
import { getJournalId } from './requests/getJournalId.ts';
import { getLedgerAccountId } from './requests/getLedgerAccountId.ts';
import { normalizeAmount } from './helpers/normalizeAmount.ts';
import { LoggedError } from '../src/LoggedError.ts';

/**
 * Importe fichier csv dans Pennylane
 */
export async function importLedgerFile(filePath: string) {
    try {
        const rows = await parseCsv(filePath);

        for (const row of rows) {
            const journalId = await getJournalId(row.Journal);
            const accountId = await getLedgerAccountId(row.NumCompteGeneral);
            const line: LedgerEntryLine = {
                ledger_account_id: accountId,
                label: row.Libelle,
                debit: normalizeAmount(row.MontantDebit),
                credit: normalizeAmount(row.MontantCredit),
            };
            await postLedgerEntry(
                journalId,
                formatDate(row.Date),
                row.Libelle,
                [line],
            );
        }

        log.info('✅ Import terminé !');
    } catch (err) {
        let errorMsg = 'Erreur import en échec... ';

        if (err instanceof Error && !(err instanceof LoggedError))
            errorMsg += err.message;

        log.error(errorMsg);
        Deno.exit(1);
    }
}
