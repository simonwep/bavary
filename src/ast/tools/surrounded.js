const optional = require('./optional');
const maybe = require('./maybe');

module.exports = (start, end, parser) => maybe(stream => {
    if (!optional(stream, 'punc', start)) {
        return null;
    }

    const content = parser(stream);
    if (!content || !optional(stream, 'punc', end)) {
        return null;
    }

    return content;
});
