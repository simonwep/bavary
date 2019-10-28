const identifier = require('./identifier');
const optional = require('../tools/optional');
const expect = require('../tools/expect');
const maybe = require('../tools/maybe');
const multiplier = require('./multiplier');
const string = require('./string');

module.exports = maybe(stream => {

    // It MAY be a type, dosn't need to though.
    if (!optional(stream, 'punc', '<')) {
        return null;
    }

    const ident = identifier(stream);
    if (!ident) {
        return stream.throwError('Expected identifier.');
    }

    let tag = null;
    if (optional(stream, 'punc', '#')) {
        tag = string(stream) || identifier(stream);

        if (!tag) {
            return stream.throwError('Expected string or identifier as tag.');
        }

        tag = tag.value;
    }

    expect(stream, 'punc', '>');
    return {
        type: 'type',
        multiplier: multiplier(stream),
        value: ident.value,
        tag
    };
});
