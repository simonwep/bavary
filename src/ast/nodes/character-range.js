const optional = require('../tools/optional');
const expect = require('../tools/expect');
const maybe = require('../tools/maybe');

module.exports = maybe(stream => {
    const from = optional(stream, 'str');

    // The keyword 'to' indicates a character range
    if (!from || !optional(stream, 'kw', 'to')) {
        return null;
    }

    const to = expect(stream, 'str');
    if (from.value.length !== 1 || to.value.length !== 1) {
        return stream.throwError('A character range needs exactly one start- and one end-character.');
    }

    let a = from.value.charCodeAt(0);
    let b = to.value.charCodeAt(0);

    if (b < a) {
        [a, b] = [b, a];
    }

    return {
        type: 'character-range',
        value: {
            from: a,
            to: b
        }
    };
});
