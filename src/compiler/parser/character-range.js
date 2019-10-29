/**
 * Parses a character-range
 * @param stream Character-stream
 * @param value
 * @param result
 * @returns {null|*}
 */
module.exports = (stream, {value: {from, to}}, result) => {
    if (!stream.hasNext()) {
        return false;
    }

    // Resolve next character / char-code
    const value = stream.next();
    const charCode = value.charCodeAt(0);

    // Check if charcode matches given range
    if (charCode >= from && charCode <= to) {
        result.str += value;
        return true;
    }

    return false;
};
