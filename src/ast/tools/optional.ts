import {TokenStream}        from '../../misc/token-stream';
import {RawType, TokenType} from '../../tokenizer/types';
import {check}              from './check';

/**
 * Same as check but consumes the value
 * @param stream
 * @param type
 * @param vals
 */
export const optional = (stream: TokenStream, type: TokenType, ...vals: Array<string | number>): RawType | null => {

    if (check(stream, type, ...vals)) {
        return stream.next();
    }

    return null;
};
