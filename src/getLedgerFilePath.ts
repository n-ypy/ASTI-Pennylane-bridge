import { log } from './logger.ts';

export function getLedgerFilePath(): string {
    const filePath = Deno.args[0];

    if (!filePath) {
        log.error(
            'Argument du chemin du fichier CSV manquant, utilisation : monprogramme.exe ./fichier.csv',
        );
        Deno.exit(1);
    }

    return filePath;
}
