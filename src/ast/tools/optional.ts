import {TokenStream}        from '../../misc/token-stream';
import {RawType, TokenType} from '../../tokenizer/types';
import {check}              from './check';

/**
 * Same as check but consumes the value
 * @param stream
 * @param strict
 * @param type
 * @param vals
 */
export const optional = (stream: TokenStream, strict: boolean, type: TokenType, ...vals: Array<string | number>): RawType | null => {
    return check(stream, strict, type, ...vals) ?
        stream.next(strict) :
        null;
};
