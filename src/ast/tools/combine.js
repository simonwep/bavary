/**
 * Accepts a list of parser and returns the first who matches the input
 * @param parsers
 * @returns {Function}
 */
module.exports = (...parsers) => stream => {
    for (const parser of parsers) {
        const result = parser(stream);

        if (result) {
            return result;
        }
    }

    return null;
};
