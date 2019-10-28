const optional = require('../tools/optional');
const combine = require('../tools/combine');
const expect = require('../tools/expect');
const maybe = require('../tools/maybe');
const check = require('../tools/check');
const multiplier = require('./multiplier');
const combinator = require('./combinator');

module.exports = maybe(stream => {

    // It MAY be a group, dosn't need to though.
    if (!optional(stream, 'punc', '[')) {
        return null;
    }

    const values = [];
    const parsers = combine(
        require('./type'),
        require('./group'),
        require('./string')
    );

    while (!check(stream, 'punc', ']')) {
        const value = parsers(stream);
        const com = combinator(stream);

        if (!value) {
            return stream.throwError('Expected a type, group or raw string.')
        }

        values.push(value);
        if (com) {
            values.push(com);
        }
    }

    expect(stream, 'punc', ']');
    return {
        type: 'group',
        multiplier: multiplier(stream),
        value: values
    };
});
