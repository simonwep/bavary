import expect      from '../tools/expect';
import maybe       from '../tools/maybe';
import optional    from '../tools/optional';
import {Reference} from '../types';

module.exports = maybe<Reference | null>(stream => {
    const spreadOperator = require('../modifiers/spread-operator');
    const lookupSequence = require('../modifiers/lookup-sequence');
    const joinTarget = require('../modifiers/join-target');
    const extensions = require('../modifiers/extensions');
    const identifier = require('./identifier');
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
        const ident = identifier(stream);

        if (!ident) {
            stream.throwError('Expected string or identifier as tag.');
        }

        tag = ident.value;
    }

    // A tag shouldn't be combined with a spread operator
    if (hasSpreadOperator && tag) {
        stream.throwError('Type cannot have both a tag an spread operator attached to it.');
    }

    expect(stream, 'punc', '>');
    const multipliers = multiplier(stream);
    const exts = extensions(stream);
    const pipeTarget = joinTarget(stream);

    // Piping cannot be done in combination with tag / spread
    if (pipeTarget && (hasSpreadOperator || tag)) {
        stream.throwError('Piping cannot be done if the spread-operator is used on it or it has a tag.');
    }

    return {
        type: 'reference',
        multiplier: multipliers,
        extensions: exts,
        join: pipeTarget,
        spread: hasSpreadOperator,
        value: seq,
        tag
    } as Reference;
});
