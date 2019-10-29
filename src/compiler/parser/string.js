/**
 * Parses a single string
 * @param stream Character-stream
 * @param value Deconstructed value of a string-type
 * @param result
 * @returns {null|*}
 */
module.exports = (stream, {value}, result) => {
    if (!stream.hasNext()) {
        return false;
    }

    stream.stash();
    for (let i = 0; i < value.length; i++) {
        const next = stream.next();

        // Check for type mismatch
        if (next !== value[i]) {
            stream.pop();
            return false;
        }
    }

    stream.recycle();
    result.str += value;
    return true;
};
