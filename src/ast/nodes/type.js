const identifier = require('../tools/identifier');
const optional = require('../tools/optional');
const expect = require('../tools/expect');
const maybe = require('../tools/maybe');
const multiplier = require('./multiplier');

module.exports = maybe(stream => {
    if (!optional(stream, 'punc', '<')) {
        return null;
    }

    const name = identifier(stream);
    if (!name) {
        stream.throwError('Expected identifier.');
    }

    expect(stream, 'punc', '>');
    return {
        type: 'type',
        multiplier: multiplier(stream),
        value: name
    };
});
