/**
 * Convertit JJ/MM/AAAA → YYYY-MM-DD
 */
export function formatDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
}
