import {TokenStream}        from '../../misc/token-stream';
import {RawType, TokenType} from '../../tokenizer/types';
import {optional}           from './optional';

/**
 * Expects a specific token (and optional value).
 * @param stream
 * @param strict
 * @param type
 * @param values
 */
export const expect = (stream: TokenStream, strict: boolean, type: TokenType, ...values: Array<string | number>): RawType | never => {

    // Check if next token matches type and value
    const expected = optional(stream, strict, type, ...values);
    if (expected !== null) {
        return expected;
    }

    const next = stream.next(strict);
    if (next !== null) {
        stream.throwError(`Expected ${values.join(', ')} (${type}) but got ${next.value} (${next.type})`);
    } else {
        stream.throwError('Unxpected end of input.');
    }
};
