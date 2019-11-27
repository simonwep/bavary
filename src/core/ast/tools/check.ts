import {Streamable}         from '../../stream';
import {RawType, TokenType} from '../../tokenizer/types';

/**
 * Checks if the next token matches type and a list of optional values
 * @param stream
 * @param type
 * @param vals
 * @returns {boolean}
 */
export const check = (stream: Streamable<RawType>, type: TokenType, ...vals: Array<string | number>): boolean => {
    const peek = stream.peek();

    // Check if type matches
    if (!peek || peek.type !== type) {
        return false;
    }

    // Check if value matches
    return !vals.length || vals.includes(peek.value);
};
