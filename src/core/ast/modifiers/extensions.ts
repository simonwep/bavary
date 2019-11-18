import expect         from '../tools/expect';
import maybe          from '../tools/maybe';
import optional       from '../tools/optional';
import {ExtensionSet} from '../types';

/**
 * Parses a lookup-sequence
 * @type {Function}
 */
module.exports = maybe<ExtensionSet | null>(stream => {
    const identifier = require('../nodes/identifier');
    const string = require('../nodes/string');

    if (!optional(stream, 'kw', 'with')) {
        return null;
    }

    expect(stream, 'punc', '(');
    const set: ExtensionSet = {};

    // Parse key-value combies
    do {
        const key = identifier(stream);

        if (!key) {
            stream.throwError('Expected identifier');
        }

        expect(stream, 'punc', '=');
        const val = string(stream);

        if (!val) {
            stream.throwError('Expected string');
        }

        set[key.value] = val.value;

        // Pairs are seperated via a comma
    } while (optional(stream, 'punc', ','));

    expect(stream, 'punc', ')');
    return set;
});
