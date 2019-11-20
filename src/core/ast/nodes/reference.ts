import expect      from '../tools/expect';
import maybe       from '../tools/maybe';
import optional    from '../tools/optional';
import {Reference} from '../types';

module.exports = maybe<Reference | null>(stream => {
    const spreadOperator = require('../modifiers/spread-operator');
    const lookupSequence = require('../modifiers/lookup-sequence');
    const extensions = require('../modifiers/extensions');
    const identifier = require('./identifier');
    const pipe = require('../modifiers/pipe');
    const string = require('./string');
    const multiplier = require('./multiplier');

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
        extensions: extensions(stream),
        pipeInto: pipe(stream),
        spread: hasSpreadOperator,
        value: seq,
        tag
    } as Reference;
});
