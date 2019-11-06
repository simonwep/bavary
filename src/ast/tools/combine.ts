import Streamable from '../../stream';
import {Token}    from '../../tokenizer';
import {ASTNode}  from '../types';

/**
 * Accepts a list of parser and returns the first who matches the input
 * @param parsers
 * @returns {Function}
 */
type Parsers = Array<(stream: Streamable<Token>) => ASTNode>
export default (...parsers: Parsers) => (stream: Streamable<Token>): ASTNode | null => {
    for (const parser of parsers) {
        const result = parser(stream);

        if (result) {
            return result;
        }
    }

    return null;
};
