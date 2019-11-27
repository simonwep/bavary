import {Streamable}  from '../stream';
import {RawType}     from '../tokenizer/types';
import {Declaration} from './types';

/**
 * Converts a array of tokens into an ast-tree.
 * @param tokens Array of raw tokens
 * @param source Source-code
 */
export const parseAST = (tokens: Array<RawType>, source: string): Array<Declaration> => {
    const declaration = require('./nodes/declaration');
    const stream = new Streamable(tokens, source);
    const declarations: Array<Declaration> = [];

    while (stream.hasNext()) {
        declarations.push(declaration(stream));
    }

    return declarations;
};
