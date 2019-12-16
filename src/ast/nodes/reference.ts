import {expect}    from '../tools/expect';
import {maybe}     from '../tools/maybe';
import {optional}  from '../tools/optional';
import {Reference} from '../types';

module.exports = maybe<Reference>(stream => {
    const parseSpreadOperator = require('../modifiers/spread-operator');
    const parseModifiers = require('../modifiers/modifications');
    const parseMultipliers = require('./multiplier');
    const parseIdentifier = require('./identifier');
    const parseArguments = require('./arguments');
    const parseTag = require('./tag');

    // It may have a spread operator attached to it
    const spread = !!parseSpreadOperator(stream);

    // It may be a type
    if (!optional(stream, false, 'punc', '<')) {
        return null;
    }

    const value: Array<string> = [];
    let expectIdentifier = false;

    while (stream.hasNext()) {
        const next = parseIdentifier(stream);

        if (next) {
            expectIdentifier = false;
            value.push(next.value);
        }

        if (!optional(stream, false, 'punc', ':')) {
            break;
        } else {
            expectIdentifier = true;
        }
    }

    if (expectIdentifier || !value.length) {
        stream.throwError('Expected identifier');
    }

    // It may have a tag
    const tag = parseTag(stream);

    // A tag shouldn't be combined with a spread operator
    if (spread && tag) {
        stream.throwError('Type cannot have both a tag an spread operator attached to it.');
    }

    const modifiers = parseModifiers(stream);
    const args = parseArguments(stream);

    expect(stream, false, 'punc', '>');
    const multiplier = parseMultipliers(stream);

    return {
        type: 'reference',
        tag: tag?.value || null,
        arguments: args,
        multiplier,
        modifiers,
        spread,
        value
    } as Reference;
});
