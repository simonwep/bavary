import {prettifyError} from './prettify-error';

export class ParsingError extends Error {

    // Error location
    public start?: number;
    public end?: number;

    // Source-code and error-message
    public source?: string;
    public description: string;

    /**
     * Sytax-error with message and position
     * @param source
     * @param description
     * @param start
     * @param end
     */
    constructor(description: string, source?: string, start?: number, end?: number) {
        /* istanbul ignore next */
        super(start !== undefined && end !== undefined && source ? prettifyError(description, source, start, end) : description);
        this.source = source;
        this.start = start;
        this.end = end;
        this.description = description;
        this.name = 'Parsing Error';
    }
}
