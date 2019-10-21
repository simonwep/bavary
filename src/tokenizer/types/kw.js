const {isNonWhitespace, isNumeric} = require('../tools/is');
const consume = require('../tools/consume');

module.exports = stream => {

    if (isNonWhitespace(stream.peek())) {
        const str = consume(stream, v => isNonWhitespace(v) || isNumeric(v));

        return str ? {
            type: 'kw',
            value: str.toLowerCase()
        } : null;
    }

    return null;

};
