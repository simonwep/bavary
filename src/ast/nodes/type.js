const identifier = require('../tools/identifier');
const optional = require('../tools/optional');
const maybe = require('../tools/maybe');
const multiplier = require('./multiplier');

module.exports = maybe(stream => {
    if (!optional(stream, 'punc', '<')) {
        return null;
    }

    const name = identifier(stream);
    if (!name || !optional(stream, 'punc', '>')) {
        return null;
    }

    return {
        type: 'type',
        multiplier: multiplier(stream),
        value: name
    };
});
