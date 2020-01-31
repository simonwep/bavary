import {TokenStream} from '../../tokenizer/token-stream';
import {parseGroup}  from '../internal';
import {maybe}       from '../tools/maybe';
import {Arguments}   from '../types';

export const parseArguments = maybe<Arguments>((stream: TokenStream) => {
    const args: Arguments = [];

    while (true) {
        const name = stream.optional('kw');

        if (!name) {
            break;
        }

        // It may have a value
        let value = null;
        if (stream.optional('punc', '=')) {
            value = parseGroup(stream);

            if (!value) {
                stream.throw('Expected a group.');
            }
        }

        args.push({name, value});
    }

    return args.length ? args : null;
});
