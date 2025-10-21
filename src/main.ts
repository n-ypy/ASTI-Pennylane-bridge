import { importLedgerFile } from '../ledgerImport/main.ts';
import { getLedgerFilePath } from './getLedgerFilePath.ts';
import { testMeEndpoint } from './testMeEndpoint.ts';

const filePath = getLedgerFilePath();

await testMeEndpoint();

importLedgerFile(filePath);
