import { importLedgerFile } from '../ledgerImport/main.ts';
import { getLedgerFilePath } from './getLedgerFilePath.ts';
import { log } from './logger.ts';
import { testMeEndpoint } from './testMeEndpoint.ts';

log.info('🚀 Démarrage');
//TODO: cache journal request
//ledger_account request once / proof number
//make config steps explicit in main.ts file
//one log file / csv file

const filePath = getLedgerFilePath();

await testMeEndpoint();

importLedgerFile(filePath);
