const optional = require('../tools/optional');
const maybe = require('../tools/maybe');
const group = require('./group');
const type = require('./type');

module.exports = maybe(stream => {

    const target = type(stream);
    if (!target || !optional(stream, 'punc', '=')) {
        return null;
    }

    // Declaration cannot have multipliers
    if (target.multiplier) {
        stream.throwError(`Declaration type cannot contain multipliers, found '${target.multiplier.value}' on ${target.name}.`);
    }

    const body = group(stream);
    if (!body) {
        return null;
    }

    return {
        type: 'declaration',
        name: target.value,
        value: body
    };
});
