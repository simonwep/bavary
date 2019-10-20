const optional = require('../tools/optional');
const combine = require('../tools/combine');
const maybe = require('../tools/maybe');
const check = require('../tools/check');
const multiplier = require('./multiplier');
const combinator = require('./combinator');

module.exports = maybe(stream => {
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
            return null;
        }

        values.push(value);
        if (com) {
            values.push(com);
        }
    }

    if (!optional(stream, 'punc', ']')){
        return null;
    }

    return {
        type: 'group',
        multiplier: multiplier(stream),
        value: values
    };
});
