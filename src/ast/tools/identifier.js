const maybe = require('./maybe');

/**
 * Parses an identifier made out of keywords, numbers or hyphens
 * @type {Function}
 */
module.exports = maybe(stream => {
    let name = '';

    while (stream.hasNext(true)) {
        const {type, value} = stream.peek(true);

        if (type === 'kw' || type === 'num' || (type === 'punc' && value === '-')) {
            name += value;
            stream.next(true);
        } else {
            break;
        }
    }

    return name || null;
});
