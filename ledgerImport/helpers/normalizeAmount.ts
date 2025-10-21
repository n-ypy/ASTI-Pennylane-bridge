import { LoggedError } from '../../src/LoggedError.ts';

/**
 * Normalise un montant en chaîne au format "123.45"
 */
export function normalizeAmount(value?: string): string {
    if (value === null || value === undefined)
        throw new LoggedError(
            '[normalizeAmount] Le montant est vide (null ou undefined). Veuillez renseigner un chiffre.',
        );

    const cleaned = value.trim().replace(',', '.');
    const num = parseFloat(cleaned);

    if (isNaN(num))
        throw new LoggedError(
            `[normalizeAmount] Le montant '${value}' n’est pas un nombre valide après nettoyage ('${cleaned}').`,
        );
    return num.toFixed(2);
}
