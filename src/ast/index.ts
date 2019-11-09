import Streamable    from '../stream';
import tokenize      from '../tokenizer';
import {Declaration} from './types';

/**
 * Converts a array of tokens into a ast-tree
 * @param defs
 */
export default (defs: string): Array<Declaration> | null => {
    const declaration = require('./nodes/declaration');
    const stream = new Streamable(tokenize(defs), defs);
    const declarations: Array<Declaration> = [];

    while (stream.hasNext()) {
        const dec = declaration(stream);

        if (dec) {
            // TODO: Throw error on default and export modifiers
            declarations.push(dec);
        } else {
            stream.throwError('Expected type-declaration.');
            return null;
        }
    }

    return declarations;
};
