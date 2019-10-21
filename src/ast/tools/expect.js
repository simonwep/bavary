const optional = require('./optional');

/**
 * Expects a specific token (and optional value).
 * @param stream
 * @param type
 * @param value
 */
module.exports = (stream, type, value) => {

    // Check if next token matches type and value
    const expected = optional(stream, type, value);
    if (expected) {
        return expected;
    }

    const next = stream.hasNext() ? stream.next() : null;
    if (next !== null) {
        const expectedVal = value ? `"${value}"` : value;
        const expectedPunc = next.type === type ? '' : ` (${type})`;
        const actualPunc = next.type === type ? '' : ` (${next.type})`;
        stream.throwError(`Expected ${expectedVal + expectedPunc} but got "${next.value}"${actualPunc}`);
    } else {
        stream.throwError('Unxpected end of input.');
    }
};
