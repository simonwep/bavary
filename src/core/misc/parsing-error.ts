import {prettifyError} from './prettify-error';

export class ParsingError extends Error {

    // Error location
    public source?: string;
    public start?: number;
    public end?: number;
    public msg: string;

    /**
     * Sytax-error with message and position
     * @param source
     * @param msg
     * @param start
     * @param end
     */
    constructor(msg: string, source?: string, start?: number, end?: number) {
        super(start && end && source ? prettifyError(msg, source, start, end) : msg);
        this.source = source;
        this.start = start;
        this.end = end;
        this.msg = msg;
        this.name = 'Parsing Error';
    }
}
