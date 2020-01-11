import {TokenStream}                                      from '../../tokenizer/token-stream';
import {parseArguments, parseIdentifier, parseMultiplier} from '../internal';
import {maybe}                                            from '../tools/maybe';
import {Reference}                                        from '../types';

export const parseReference = maybe<Reference>((stream: TokenStream) => {

    // It may be a type
    if (!stream.optional(false, 'punc', '<')) {
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

        if (!stream.optional(false, 'punc', ':')) {
            break;
        } else {
            expectIdentifier = true;
        }
    }

    if (expectIdentifier || !value.length) {
        stream.throw('Expected identifier');
    }

    const args = parseArguments(stream);
    stream.expect(false, 'punc', '>');
    return {
        type: 'reference',
        arguments: args,
        multiplier: parseMultiplier(stream),
        value
    } as Reference;
});
