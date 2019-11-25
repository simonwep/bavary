import expect      from '../tools/expect';
import maybe       from '../tools/maybe';
import optional    from '../tools/optional';
import {Reference} from '../types';

module.exports = maybe<Reference>(stream => {
    const spreadOperator = require('../modifiers/spread-operator');
    const parseModifiers = require('../modifiers/modifications');
    const joinTarget = require('../modifiers/join-target');
    const parseMultipliers = require('./multiplier');
    const identifier = require('./identifier');

    // It may have a spread operator attached to it
    const spread = !!spreadOperator(stream);

    // It may be a type
    if (!optional(stream, 'punc', '<')) {
        return null;
    }

    const value: Array<string> = [];
    let expectIdentifier = false;

    while (stream.hasNext()) {
        const next = identifier(stream);

        if (next) {
            expectIdentifier = false;
            value.push(next.value);
        } else if (!optional(stream, 'punc', ':')) {
            break;
        } else {
            expectIdentifier = true;
        }
    }

    if (expectIdentifier) {
        stream.throwError('Expected identifier');
    } else if (!value.length) {
        stream.throwError('Expected a reference.');
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
        type: 'reference',
        multiplier,
        modifiers,
        spread,
        value,
        join,
        tag
    } as Reference;
});
