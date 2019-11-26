import {Streamable} from '../../stream';
import {RawType}    from '../../tokenizer/types';
import {ASTNode}    from '../types';

/**
 * Accepts a list of parser and returns the first who matches the input
 * @param parsers
 * @returns {Function}
 */
export const combine = <T = ASTNode>(
    ...parsers: Array<(stream: Streamable<RawType>) => T>
) => (stream: Streamable<RawType>): T | null => {
        for (const parser of parsers) {
            const result = parser(stream);

            if (result !== null) {
                return result;
            }
        }

        return null;
    };
