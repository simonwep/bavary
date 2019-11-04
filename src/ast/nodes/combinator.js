const optional = require('../tools/optional');
const maybe = require('../tools/maybe');

module.exports = maybe(stream => {
    const combinator = optional(stream, 'punc', '|', '&');

    if (!combinator) {
        return null;
    }

    // It may be a extended combinator
    if (combinator.value === '&' && optional(stream, 'punc', '&')) {
        combinator.value += '&';
    }

    return {
        type: 'combinator',
        value: combinator.value
    };
});
