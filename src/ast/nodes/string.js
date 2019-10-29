const optional = require('../tools/optional');
const maybe = require('../tools/maybe');

module.exports = maybe(stream => {
    const string = optional(stream, 'str');

    if (string && !string.value.length) {
        return stream.throwError('Strings shouldn\'t be empty.');
    }

    return string ? {
        type: 'string',
        value: string.value
    } : null;
});
