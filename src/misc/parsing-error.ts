import prettyPrintError from './prettify-error';

export default class ParsingError extends Error {

    // Error location
    public start: number;
    public end: number;
    public msg: string;

    /**
     * Sytax-error with message and position
     * @param source
     * @param msg
     * @param start
     * @param end
     */
    constructor(source: string, msg: string, start: number, end: number) {
        super(`\n${prettyPrintError(source, msg, start, end)}`);
        this.start = start;
        this.end = end;
        this.msg = msg;
        this.name = 'Parsing Error';
    }
}
