const identifier = require('../tools/identifier');
const optional = require('../tools/optional');
const expect = require('../tools/expect');
const maybe = require('../tools/maybe');
const multiplier = require('./multiplier');
const string = require('./string');

module.exports = maybe(stream => {
    if (!optional(stream, 'punc', '<')) {
        return null;
    }

    const value = identifier(stream);
    if (!value) {
        return stream.throwError('Expected identifier.');
    }

    let tag = null;
    if (optional(stream, 'punc', '#')) {
        tag = string(stream) || identifier(stream);

        if (!tag) {
            return stream.throwError('Expected string or identifier as tag.');
        }
        tag = tag.value || tag;

    }

    expect(stream, 'punc', '>');
    return {
        type: 'type',
        multiplier: multiplier(stream),
        tag,
        value
    };
});
