import expect      from '../tools/expect';
import maybe       from '../tools/maybe';
import optional    from '../tools/optional';
import {Reference} from '../types';

module.exports = maybe<Reference | null>(stream => {
    const lookupSequence = require('./lookup-sequence');
    const spreadOperator = require('./spread-operator');
    const identifier = require('./identifier');
    const multiplier = require('./multiplier');
    const string = require('./string');

    // It may have a spread operator attached to it
    const hasSpreadOperator = !!spreadOperator(stream);

    // It may be a type
    if (!optional(stream, 'punc', '<')) {
        return null;
    }

    const seq = lookupSequence(stream);

    // It may have a tag
    let tag: string | null = null;
    if (optional(stream, 'punc', '#')) {
        const opt = string(stream) || identifier(stream);

        if (!opt) {
            stream.throwError('Expected string or identifier as tag.');
        }

        tag = opt.value;
    }

    // A tag shouldn't be combined with a spread operator
    if (hasSpreadOperator && tag) {
        stream.throwError('Type cannot have both a tag an spread operator attached to it.');
    }

    expect(stream, 'punc', '>');
    return {
        type: 'reference',
        multiplier: multiplier(stream),
        value: seq.value,
        spread: hasSpreadOperator,
        tag
    } as Reference;
});
