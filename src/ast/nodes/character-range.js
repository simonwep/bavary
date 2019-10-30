const unicodeEscape = require('../tools/unicode-escape');
const optional = require('../tools/optional');
const maybe = require('../tools/maybe');

const parsePoint = stream => {
    const str = optional(stream, 'str');

    if (str) {
        const {value} = str;
        return value.length === 1 ? value.charCodeAt(0) : null;
    }

    return unicodeEscape(stream);
};

module.exports = maybe(stream => {
    let from = parsePoint(stream);

    // The keyword 'to' indicates a character range
    if (!from || !optional(stream, 'kw', 'to')) {
        return null;
    }

    let to = parsePoint(stream);
    if (!to) {
        return stream.throwError('Expected range-end');
    }

    if (to < from) {
        [to, from] = [from, to];
    }

    return {
        type: 'character-range',
        value: {
            from,
            to
        }
    };
});
