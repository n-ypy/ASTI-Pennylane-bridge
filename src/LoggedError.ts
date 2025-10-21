import { log } from './logger.ts';

export class LoggedError extends Error {
    constructor(message: any) {
        log.error(message);
        super(message);
    }
}
