import maybe            from '../tools/maybe';
import optional         from '../tools/optional';
import {LookupSequence} from '../types';

/**
 * Parses a lookup-sequence
 * @type {Function}
 */
module.exports = maybe<LookupSequence | null>(stream => {
    const identifier = require('./identifier');
    const sequence: Array<string> = [];

    while (stream.hasNext()) {
        const next = identifier(stream);

        if (next) {
            sequence.push(next.value);
        } else if (!optional(stream, 'punc', ':')) {
            break;
        }
    }

    return {
        type: 'lookup-sequence',
        value: sequence
    } as LookupSequence;
});
