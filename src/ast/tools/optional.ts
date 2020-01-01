import {TokenStream}      from '../../tokenizer/stream/token-stream';
import {Token, TokenType} from '../../tokenizer/types';
import {check}            from './check';

/**
 * Same as check but consumes the value
 * @param stream
 * @param strict
 * @param type
 * @param vals
 */
export const optional = (stream: TokenStream, strict: boolean, type: TokenType, ...vals: Array<string | number>): string | number | null => {
    return check(stream, strict, type, ...vals) ?
        (stream.next(strict) as Token).value :
        null;
};
