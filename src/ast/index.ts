import Streamable from '../stream';
import tokenize   from '../tokenizer';
import {ASTNode}  from './types';

/**
 * Converts a array of tokens into a ast-tree
 * @param defs
 */
export default (defs: string): Array<ASTNode> | null => {
    const declaration = require('./nodes/declaration');
    const stream = new Streamable(tokenize(defs), defs);
    const declarations: Array<ASTNode> = [];

    while (stream.hasNext()) {
        const dec = declaration(stream);

        if (dec) {
            declarations.push(dec);
        } else {
            stream.throwError('Expected type-declaration.');
            return null;
        }
    }

    return declarations;
};
