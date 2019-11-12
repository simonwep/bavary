import expect      from '../tools/expect';
import maybe       from '../tools/maybe';
import optional    from '../tools/optional';
import {Reference} from '../types';

module.exports = maybe<Reference | null>(stream => {
    const lookupSequence = require('./lookup-sequence');
    const identifier = require('./identifier');
    const multiplier = require('./multiplier');
    const string = require('./string');

    // It may be a type
    if (!optional(stream, 'punc', '<')) {
        return null;
    }

    const seq = lookupSequence(stream);
    if (!seq) {
        stream.throwError('Expected identifier.');
    }

    let tag: string | null = null;
    if (optional(stream, 'punc', '#')) {
        const opt = string(stream) || identifier(stream);

        if (!opt) {
            stream.throwError('Expected string or identifier as tag.');
        }

        tag = opt.value;
    }

    expect(stream, 'punc', '>');
    return {
        type: 'reference',
        multiplier: multiplier(stream),
        value: seq.value,
        tag
    } as Reference;
});
