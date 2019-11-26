import maybe    from '../tools/maybe';
import optional from '../tools/optional';

module.exports = maybe<string | null>(stream => {
    const identifier = require('./identifier');

    if (optional(stream, 'punc', '-') &&
        optional(stream, 'punc', '>')) {
        const ident = identifier(stream);

        if (!ident) {
            stream.throwError('Expected identifier.');
        }

        return ident;
    }

    return null;
});
