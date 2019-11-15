import Streamable           from '../../stream';
import {RawType, TokenType} from '../../tokenizer/types';
import optional             from './optional';

/**
 * Expects a specific token (and optional value).
 * @param stream
 * @param type
 * @param values
 */
export default (stream: Streamable<RawType>, type: TokenType, ...values: Array<string | number>): RawType | void => {

    // Check if next token matches type and value
    const expected = optional(stream, type, ...values);

    if (expected) {
        return expected;
    }

    const next = stream.hasNext() ? stream.peek() : null;
    if (next !== null) {
        stream.throwError(`Expected ${values.join(', ')} (${type}) but got ${next.value} (${next.type})`);
    } else {
        stream.throwError('Unxpected end of input.');
    }
};