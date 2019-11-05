const prettyPrintError = require('./pretty-print-error');

module.exports = class ParsingError extends Error {

    /**
     * Sytax-error with message and position
     * @param source
     * @param msg
     * @param start
     * @param end
     */
    constructor(source, msg, start, end) {
        super(`\n${prettyPrintError(source, msg, start, end)}`);
        this.start = start;
        this.end = end;
        this.msg = msg;
        this.name = 'Parsing Error';
    }
};
