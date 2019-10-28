const ParsingError = require('./misc/parsing-error.js');

/**
 * Creates a new stream out of an array of values and an optional "source-map"
 * @param vals
 * @param source Optional source-code to prettify error messages
 * @returns Streaming object
 */
module.exports = (vals, source = null) => {
    const stashed = [];
    let index = 0;

    if (typeof source !== 'string' && source !== null) {
        throw 'Source must be a string.';
    }

    return {
        stash: () => stashed.push(index),
        pop: () => index = stashed.pop(),
        next: () => vals[index++],
        peek: () => vals[index],
        hasNext: () => index < vals.length,
        recycle: () => stashed.pop(),

        /**
         * Throws an ParsingError
         * @param msg
         */
        throwError(msg) {

            if (!source) {
                throw msg;
            }

            // Throw ParsingError with source-location
            if (index < vals.length) {
                const peek = vals[index];
                throw new ParsingError(source, msg, peek.start, peek.end);
            } else {
                throw new ParsingError(source, msg, index, index);
            }
        },

        get index() {
            return index;
        }
    };
};
