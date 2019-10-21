const {isNumeric} = require('../tools/is');

module.exports = stream => {

    let number = '';
    while (stream.hasNext()) {
        const ch = stream.peek();

        if (isNumeric(ch)) {
            number += ch;
        } else {
            break;
        }

        stream.next();
    }

    return number.length ? {
        type: 'num',
        value: Number(number)
    } : null;
};
