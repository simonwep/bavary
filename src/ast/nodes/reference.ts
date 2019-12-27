import {argument, identifier, multiplier, tag} from '../internal';
import {modifiers}                             from '../modifiers/modifications';
import {spreadOperator}                        from '../modifiers/spread-operator';
import {expect}                                from '../tools/expect';
import {maybe}                                 from '../tools/maybe';
import {optional}                              from '../tools/optional';
import {Reference}                             from '../types';

export const reference = maybe<Reference>(stream => {

    // It may have a spread operator attached to it
    const spread = !!spreadOperator(stream);

    // It may be a type
    if (!optional(stream, false, 'punc', '<')) {
        return null;
    }

    const value: Array<string> = [];
    let expectIdentifier = false;

    while (stream.hasNext()) {
        const next = identifier(stream);

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
    const tagVal = tag(stream);

    // A tag shouldn't be combined with a spread operator
    if (spread && tagVal) {
        stream.throwError('Type cannot have both a tag an spread operator attached to it.');
    }

    const mods = modifiers(stream);
    const args = argument(stream); // TODO: This names are shitty

    expect(stream, false, 'punc', '>');
    const mult = multiplier(stream);

    return {
        type: 'reference',
        tag: tagVal?.value || null,
        arguments: args,
        modifiers: mods,
        multiplier: mult,
        spread,
        value
    } as Reference;
});
