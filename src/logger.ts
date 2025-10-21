import { LOG_FILE } from './config.ts';

function format(level: string, message: string): string {
    const now = new Date().toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
    });
    return `[${now}] [${level}] ${message}`;
}

function writeToFile(line: string) {
    const data = line + '\n';
    Deno.writeTextFileSync(LOG_FILE, data, { append: true, create: true });
}

export const log = {
    info: (msg: string) => {
        const line = format('ℹ️ INFO', msg);
        console.log(line);
        writeToFile(line);
    },
    warn: (msg: string) => {
        const line = format('⚠️ WARN', msg);
        console.warn(line);
        writeToFile(line);
    },
    error: (msg: string) => {
        const line = format('❌ ERROR', msg);
        console.error(line);
        writeToFile(line);
    },
};
