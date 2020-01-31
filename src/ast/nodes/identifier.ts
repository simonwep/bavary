import {TokenStream} from '../../tokenizer/token-stream';
import {maybe}       from '../tools/maybe';
import {Identifier}  from '../types';

/**
 * Parses an identifier made out of keywords, numbers or hyphens
 * @type {Function}
 */
export const parseIdentifier = maybe<Identifier>((stream: TokenStream) => {
    const name = stream.optional('kw');
    return name && name.length ? {
        type: 'identifier',
        value: name
    } as Identifier : null;
});
