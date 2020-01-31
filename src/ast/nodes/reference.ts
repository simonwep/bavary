import {TokenStream}                     from '../../tokenizer/token-stream';
import {parseArguments, parseMultiplier} from '../internal';
import {maybe}                           from '../tools/maybe';
import {Reference}                       from '../types';

export const parseReference = maybe<Reference>((stream: TokenStream) => {

    // It may be a type
    if (!stream.optional('punc', '<')) {
        return null;
    }

    const value: Array<string> = [];
    let expectIdentifier = false;

    while (stream.hasNext()) {
        const next = stream.optional('kw');

        if (next) {
            expectIdentifier = false;
            value.push(next); // TODO: Typed optional / expect?!
        }

        if (!stream.optional('punc', ':')) {
            break;
        } else {
            expectIdentifier = true;
        }
    }

    if (expectIdentifier || !value.length) {
        stream.throw('Expected identifier');
    }

    const args = parseArguments(stream);
    stream.expect('punc', '>');
    return {
        type: 'reference',
        arguments: args,
        multiplier: parseMultiplier(stream),
        value
    } as Reference;
});
