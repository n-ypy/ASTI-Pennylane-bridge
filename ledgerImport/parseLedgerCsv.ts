import { parse } from '@std/csv';
import { log } from '../src/logger.ts';

enum ChampEcritureGenerale {
    TypeLigne = 0,
    Journal,
    Date,
    NumPiece,
    NumFacture,
    Reference,
    NumCompteGeneral,
    NumCompteTiers,
    Libelle,
    DateEcheance,
    MontantDebit,
    MontantCredit,
}

export interface EcritureCsv {
    TypeLigne: string;
    Journal: string;
    Date: string;
    NumPiece: string;
    NumFacture: string;
    Reference: string;
    NumCompteGeneral: string;
    NumCompteTiers: string;
    Libelle: string;
    DateEcheance: string;
    MontantDebit: string;
    MontantCredit: string;
}

/**
 * Parse le fichier CSV avec la stdlib Deno
 */
export async function parseCsv(filePath: string): Promise<EcritureCsv[]> {
    log.info(`[parseCsv] Démarrage du parsing du fichier : ${filePath}`);

    log.info(`[parseCsv] Lecture du contenu du fichier`);
    const csvText = await Deno.readTextFile(filePath);
    log.info(
        `[parseCsv] Fichier lu. Taille du contenu : ${csvText.length} caractères.`,
    );

    log.info(`[parseCsv] Début du parsing des données CSV...`);
    const records = await parse(csvText, {
        separator: ';',
        skipFirstRow: false,
    });
    log.info(
        `[parseCsv] Parsing terminé. Nombre d'enregistrements bruts (lignes) : ${records.length}`,
    );

    return records.map((row: string[]) => ({
        TypeLigne: row[ChampEcritureGenerale.TypeLigne],
        Journal: row[ChampEcritureGenerale.Journal],
        Date: row[ChampEcritureGenerale.Date],
        NumPiece: row[ChampEcritureGenerale.NumPiece],
        NumFacture: row[ChampEcritureGenerale.NumFacture],
        Reference: row[ChampEcritureGenerale.Reference],
        NumCompteGeneral: row[ChampEcritureGenerale.NumCompteGeneral],
        NumCompteTiers: row[ChampEcritureGenerale.NumCompteTiers],
        Libelle: row[ChampEcritureGenerale.Libelle],
        DateEcheance: row[ChampEcritureGenerale.DateEcheance],
        MontantDebit: row[ChampEcritureGenerale.MontantDebit],
        MontantCredit: row[ChampEcritureGenerale.MontantCredit],
    }));
}
