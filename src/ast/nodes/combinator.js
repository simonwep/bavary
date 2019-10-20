const optional = require('../tools/optional');
const maybe = require('../tools/maybe');

module.exports = maybe(stream => {
    const combinator = optional(stream, 'punc', '|');

    return combinator ? {
        type: 'combinator',
        value: combinator.value
    } : null;
});
