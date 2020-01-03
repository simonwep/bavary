import {TokenStream} from '../../tokenizer/stream/token-stream';
import {Token}       from '../../tokenizer/types';
import {maybe}       from '../tools/maybe';
import {Identifier}  from '../types';

/**
 * Parses an identifier made out of keywords, numbers or hyphens
 * @type {Function}
 */
export const parseIdentifier = maybe<Identifier>((stream: TokenStream) => {
    let name = '';

    while (stream.hasNext(true)) {
        const {type, value} = stream.peek(true) as Token;

        if (type === 'ws') {
            break;
        } else if (
            (type === 'punc' && value === '-' && name.length) ||
            (type === 'num') ||
            (type === 'kw')
        ) {
            name += value;
            stream.next(true);
        } else {
            break;
        }
    }

    if (name.endsWith('-')) {
        stream.throwError('Identifier cannot end with a hyphen');
    }

    return name.length ? {
        type: 'identifier',
        value: name
    } as Identifier : null;
});
