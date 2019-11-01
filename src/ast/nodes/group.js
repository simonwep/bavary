const optional = require('../tools/optional');
const combine = require('../tools/combine');
const expect = require('../tools/expect');
const maybe = require('../tools/maybe');
const check = require('../tools/check');
const multiplier = require('./multiplier');
const combinator = require('./combinator');

module.exports = maybe(stream => {

    // It may be a group
    if (!optional(stream, 'punc', '[')) {
        return null;
    }

    const values = [];
    const parsers = combine(
        require('./type'),
        require('./group'),
        require('./character-range'),
        require('./string')
    );

    let comg;
    while (!check(stream, 'punc', ']')) {
        const value = parsers(stream);
        const com = combinator(stream);

        if (!value) {
            return stream.throwError('Expected a type, group or raw string.');
        }

        if (com) {

            // Append to previous group
            if (comg) {
                if (com.value === comg.sign) {
                    comg.value.push(value);
                    continue;
                } else {
                    values.push(comg);
                    comg = null;
                }
            }

            // Consume next
            comg = {
                type: 'combinator',
                sign: com.value,
                value: [value]
            };
        } else if (comg) {
            comg.value.push(value);
            values.push(comg);
            comg = null;
        } else {
            values.push(value);
        }
    }

    if (comg) {
        values.push(comg);
    }

    expect(stream, 'punc', ']');
    return {
        type: 'group',
        multiplier: multiplier(stream),
        value: values
    };
});
