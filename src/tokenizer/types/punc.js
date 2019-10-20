const {isPunctuation} = require('../tools/is');

module.exports = stream => {

    if (isPunctuation(stream.peek())) {
        return {
            type: 'punc',
            value: stream.next()
        };
    }

    return null;
};
