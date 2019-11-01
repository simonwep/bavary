const optional = require('../tools/optional');
const expect = require('../tools/expect');
const maybe = require('../tools/maybe');
const group = require('./group');
const type = require('./type');

module.exports = maybe(stream => {

    // Parse optional variant
    const variant = optional(stream, 'kw', 'entry', 'default', 'export');

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


    // A declaration value could be either a group or scoped block
    const body = group(stream) || require('./block')(stream);
    if (!body) {
        return stream.throwError('A declaration consists of one group.');
    }

    // If the variant is 'export' a block is required
    if (variant === 'export' && body.type !== 'block') {
        return stream.throwError('Types can only be exported in blocks.');
    }

    return {
        type: 'declaration',
        name: target ? target.value : null,
        variant: variant ? variant.value : null,
        value: body
    };
});
