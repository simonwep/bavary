import maybe            from '../tools/maybe';
import optional         from '../tools/optional';
import {LookupSequence} from '../types';

/**
 * Parses a lookup-sequence
 * @type {Function}
 */
module.exports = maybe<LookupSequence | null>(stream => { // TODO: Remove extra type
    const identifier = require('./identifier');
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
        stream.throwError('Reference cannot be emtpy.');
    }

    return {
        type: 'lookup-sequence',
        value: sequence
    } as LookupSequence;
});
