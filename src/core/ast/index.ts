import Streamable    from '../stream';
import tokenize      from '../tokenizer';
import {Declaration} from './types';

/**
 * Converts a array of tokens into a ast-tree
 * @param defs
 */
export default (defs: string): Array<Declaration> => {
    const declaration = require('./nodes/declaration');
    const stream = new Streamable(tokenize(defs), defs);
    const declarations: Array<Declaration> = [];

    while (stream.hasNext()) {
        declarations.push(declaration(stream));
    }

    return declarations;
};
