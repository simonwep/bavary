import Streamable         from '../../stream';
import {Token, TokenType} from '../../tokenizer/types';
import optional           from './optional';

/**
 * Expects a specific token (and optional value).
 * @param stream
 * @param type
 * @param values
 */
export default (stream: Streamable<Token>, type: TokenType, ...values: Array<string | number>): Token | null => {

    // Check if next token matches type and value
    const expected = optional(stream, type, ...values);

    if (expected) {
        return expected;
    }

    const next = stream.hasNext() ? stream.peek() : null;
    if (next !== null) {
        const expectedVal = values.length ? ` "${values.join(' / ')}"` : '';
        const expectedPunc = next.type === type ? '' : ` (${type})`;
        const actualPunc = next.type === type ? '' : ` (${next.type})`;
        stream.throwError(`Expected${expectedVal + expectedPunc} but got "${next.value}"${actualPunc}`);
    } else {
        stream.throwError('Unxpected end of input.');
    }

    return null;
};
