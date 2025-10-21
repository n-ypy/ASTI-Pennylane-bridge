import { importLedgerFile } from '../ledgerImport/main.ts';
import { getLedgerFilePath } from './getLedgerFilePath.ts';
import { log } from './logger.ts';
import { testMeEndpoint } from './testMeEndpoint.ts';

log.info('🚀 Démarrage');

const filePath = getLedgerFilePath();

await testMeEndpoint();

importLedgerFile(filePath);
