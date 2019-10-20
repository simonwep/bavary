const optional = require('../tools/optional');
const maybe = require('../tools/maybe');

module.exports = maybe(stream => {
    const string = optional(stream, 'str');

    return string ? {
        type: 'string',
        value: string.value
    } : null;
});
