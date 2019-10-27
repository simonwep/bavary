const optional = require('../tools/optional');
const maybe = require('../tools/maybe');
const group = require('./group');
const type = require('./type');

module.exports = maybe(stream => {

    // Parse optional variant
    const variant = optional(stream, 'kw', 'entry');

    // Parse
    const target = type(stream);
    if (!target || !optional(stream, 'punc', '=')) {
        return stream.throwError('Expected declaration.');
    }

    // Declaration cannot have multipliers
    if (target.multiplier) {
        return stream.throwError('Declaration type cannot contain multipliers.');
    }

    // Neither can they have tag
    if (target.tag) {
        return stream.throwError('Declaration type cannot have a tag.');
    }

    const body = group(stream);
    if (!body) {
        return stream.throwError('A declaration consists of one group.');
    }

    return {
        type: 'declaration',
        name: target.value,
        variant: variant ? variant.value : null,
        value: body
    };
});
