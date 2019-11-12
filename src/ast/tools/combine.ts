import Streamable from '../../stream';
import {RawType}  from '../../tokenizer/types';
import {ASTNode}  from '../types';

/**
 * Accepts a list of parser and returns the first who matches the input
 * @param parsers
 * @returns {Function}
 */
type Parsers = Array<(stream: Streamable<RawType>) => ASTNode>
export default (...parsers: Parsers) => (stream: Streamable<RawType>): ASTNode | null => {
    for (const parser of parsers) {
        const result = parser(stream);

        if (result) {
            return result;
        }
    }

    return null;
};
