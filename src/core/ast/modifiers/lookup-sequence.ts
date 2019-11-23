import maybe    from '../tools/maybe';
import optional from '../tools/optional';

/**
 * Parses a lookup-sequence
 * @type {Function}
 */
module.exports = maybe<Array<string> | null>(stream => {
    const identifier = require('../nodes/identifier');
    const sequence: Array<string> = [];
    let expectIdentifier = false;

    while (stream.hasNext()) {
        const next = identifier(stream);

        if (next) {
            expectIdentifier = false;
            sequence.push(next.value);
        } else if (!optional(stream, 'punc', ':')) {
            break;
        } else {
            expectIdentifier = true;
        }
    }

    if (expectIdentifier) {
        stream.throwError('Expected identifier');
    } else if (!sequence.length) {
        stream.throwError('Container cannot be emtpy.');
    }

    return sequence;
});
