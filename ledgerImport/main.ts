import { log } from '../src/logger.ts';
import {
    LedgerEntryLine,
    postLedgerEntry,
} from './requests/postLedgerEntry.ts';
import { formatDate } from './helpers/formatDate.ts';
import { EcritureCsv, parseCsv } from './parseLedgerCsv.ts';
import { getJournalId } from './requests/getJournalId.ts';
import { getLedgerAccountId } from './requests/getLedgerAccountId.ts';
import { normalizeAmount } from './helpers/normalizeAmount.ts';
import { LoggedError } from '../src/LoggedError.ts';

export interface LedgerEntry {
    date: string;
    label: string;
    journal_id: number | null;
    ledger_entry_lines: LedgerEntryLine[];
}

/**
 * Importe fichier csv dans Pennylane
 */
export async function importLedgerFile(filePath: string) {
    log.info(
        `[importLedgerFile] Démarrage de l'importation du fichier : ${filePath}`,
    );
    try {
        log.info('[importLedgerFile] Phase 1: Parsing du fichier CSV...');
        const rows = await parseCsv(filePath);

        const ledgerEntry: LedgerEntry = {
            date: '',
            label: '',
            journal_id: null,
            ledger_entry_lines: [],
        };

        log.info(
            '[importLedgerFile] Phase 2: Traitement et regroupement des lignes...',
        );
        let numPiece;
        for (let index = 0; index < rows.length; index++) {
            const row: EcritureCsv = rows[index];

            if (numPiece != row.NumPiece) {
                if (ledgerEntry.ledger_entry_lines.length > 0) {
                    log.info(
                        `[importLedgerFile] Changement de pièce détecté. Envoi de l'écriture précédente (${ledgerEntry.ledger_entry_lines.length} lignes) pour la pièce ${numPiece}...`,
                    );
                    await postLedgerEntry(ledgerEntry);
                }
                log.info(
                    `[importLedgerFile] Nouvelle pièce numéro: ${row.NumPiece}`,
                );
                numPiece = row.NumPiece;
                ledgerEntry.ledger_entry_lines = [];
            }

            const lineNumber = index + 1;
            log.info(
                `[importLedgerFile] Ligne ${lineNumber}: Début traitement...`,
            );
            const journalId = await getJournalId(row.Journal);
            const accountId = await getLedgerAccountId(row.NumCompteGeneral);

            const line: LedgerEntryLine = {
                ledger_account_id: accountId,
                label: row.Libelle,
                debit: normalizeAmount(row.MontantDebit),
                credit: normalizeAmount(row.MontantCredit),
            };

            //Mouai, pas sûr: est-ce que la date/libelle/journal même pour chaque ligne d'une pièce comptable ?
            //peut-être throw si ils changent ?
            ledgerEntry.date = formatDate(row.Date);
            ledgerEntry.label = row.Libelle;
            ledgerEntry.journal_id = journalId;
            //
            ledgerEntry.ledger_entry_lines.push(line);
            log.info(
                `[importLedgerFile] Ligne ${lineNumber}: Fin traitement - Date: ${ledgerEntry.date}, Label: ${ledgerEntry.label}, Journal_id: ${ledgerEntry.journal_id}, Ligne: ${JSON.stringify(line)}`,
            );

            if (index == rows.length - 1) {
                log.info(
                    `[importLedgerFile] Dernière ligne du fichier. Envoi de l'écriture...`,
                );
                await postLedgerEntry(ledgerEntry);
            }
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
