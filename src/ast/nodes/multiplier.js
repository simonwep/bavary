const optional = require('../tools/optional');
const maybe = require('../tools/maybe');

module.exports = maybe(stream => {
    const mp = optional(stream, 'punc', '*', '+', '?', '!');

    return mp ? {
        type: 'single',
        value: mp.value
    } : null;
});
