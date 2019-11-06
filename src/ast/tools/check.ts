import Streamable         from '../../stream';
import {Token, TokenType} from '../../tokenizer';

/**
 * Checks if the next token matches type and a list of optional values
 * @param stream
 * @param type
 * @param vals
 * @returns {boolean}
 */
export default (stream: Streamable<Token>, type: TokenType, ...vals): boolean => {
    const peek = stream.peek();

    // Check if type matches
    if (!peek || peek.type !== type) {
        return false;
    }

    // Check if value matches
    return !vals.length || vals.includes(peek.value);
};
