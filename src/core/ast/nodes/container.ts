import expect      from '../tools/expect';
import maybe       from '../tools/maybe';
import optional    from '../tools/optional';
import {Container} from '../types';

module.exports = maybe<Container | null>(stream => {
    const spreadOperator = require('../modifiers/spread-operator');
    const parseModifiers = require('../modifiers/modifications');
    const joinTarget = require('../modifiers/join-target');
    const parseMultipliers = require('./multiplier');
    const reference = require('./reference');
    const identifier = require('./identifier');
    const group = require('./group');

    // It may have a spread operator attached to it
    const spread = !!spreadOperator(stream);

    // It may be a type
    if (!optional(stream, 'punc', '<')) {
        return null;
    }

    const value = reference(stream) || group(stream);
    if (!value) {
        stream.throwError('Expected a reference or group');
    }

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
    if (spread && tag) {
        stream.throwError('Type cannot have both a tag an spread operator attached to it.');
    }

    const modifiers = parseModifiers(stream);

    expect(stream, 'punc', '>');
    const multiplier = parseMultipliers(stream);
    const join = joinTarget(stream);

    // Piping cannot be done in combination with tag / spread
    if (join && (spread || tag)) {
        stream.throwError('Piping cannot be done if the spread-operator is used on it or it has a tag.');
    }

    return {
        type: 'container',
        multiplier,
        modifiers,
        spread,
        value,
        join,
        tag
    } as Container;
});
