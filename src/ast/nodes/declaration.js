const optional = require('../tools/optional');
const expect = require('../tools/expect');
const maybe = require('../tools/maybe');
const group = require('./group');
const type = require('./type');

module.exports = maybe(stream => {

    // Parse optional variant
    const variant = optional(stream, 'kw', 'entry', 'default');

    // Parse
    const target = type(stream);

    if (target) {
        expect(stream, 'punc', '=');

        // Declaration cannot have multipliers
        if (target.multiplier) {
            return stream.throwError('Declaration type cannot contain multipliers.');
        }

        // Neither can they have tag
        if (target.tag) {
            return stream.throwError('Declaration type cannot have a tag.');
        }

    } else if (!variant) {
        return stream.throwError('Expected declaration.');
    }


    const body = group(stream) || require('./block')(stream);
    if (!body) {
        return stream.throwError('A declaration consists of one group.');
    }

    return {
        type: 'declaration',
        name: target ? target.value : null,
        variant: variant ? variant.value : null,
        value: body
    };
});
