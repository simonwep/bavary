import {TokenStream} from '../../misc/token-stream';
import {TokenType}   from '../../tokenizer/types';

/**
 * Checks if the next token matches type and a list of optional values
 * @param stream
 * @param type
 * @param vals
 * @returns {boolean}
 */
export const check = (stream: TokenStream, type: TokenType, ...vals: Array<string | number>): boolean => {
    const peek = stream.peek();

    // Check if type matches
    if (!peek || peek.type !== type) {
        return false;
    }

    // Check if value matches
    return !vals.length || vals.includes(peek.value);
};
