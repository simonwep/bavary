import {TokenStream}                 from '../../tokenizer/stream/token-stream';
import {parseGroup, parseIdentifier} from '../internal';
import {maybe}                       from '../tools/maybe';
import {Arguments}                   from '../types';

export const parseArguments = maybe<Arguments>((stream: TokenStream) => {
    const args: Arguments = [];

    while (true) {
        stream.consumeSpace();
        const name = parseIdentifier(stream)?.value;

        if (!name) {
            break;
        }

        // It may have a value
        let value = null;
        if (stream.optional(false, 'punc', '=')) {
            value = parseGroup(stream);

            if (!value) {
                stream.throwError('Expected a group.');
            }
        }

        args.push({name, value});
    }

    return args.length ? args : null;
});
