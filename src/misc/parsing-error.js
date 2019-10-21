module.exports = class ParsingError extends Error {

    /**
     * Sytax-error with message and position
     * @param msg
     * @param start
     * @param end
     */
    constructor(msg, start, end) {
        super(msg);
        this.start = start;
        this.end = end;
    }
};
