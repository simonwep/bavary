const escaped = require('../tools/escaped');

module.exports = stream => {
    for (const char of ['\'', '"', '`']) {
        stream.stash();

        if (stream.peek() === char) {
            stream.next();

            const value = escaped(stream, char);
            if (value !== null) {
                return {
                    type: 'str',
                    value
                };
            }
        }

        stream.pop();
    }

    return null;
};
