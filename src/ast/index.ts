import {TokenStream}      from '../tokenizer/stream/token-stream';
import {Token}            from '../tokenizer/types';
import './internal';
import {parseDeclaration} from './nodes/declaration';
import {Declaration}      from './types';

/**
 * Converts a array of tokens into an ast-tree.
 * @param tokens Array of raw tokens
 * @param source Source-code
 */
export const parse = (tokens: Array<Token>, source: string): Array<Declaration> => {
    const stream = new TokenStream(tokens, source);
    const declarations: Array<Declaration> = [];

    while (stream.hasNext()) {
        declarations.push(parseDeclaration(stream) as Declaration);
    }

    // Throw error if tokens were left unparsed
    if (stream.hasNext()) {
        stream.throwError('Unexpected token');
    }

    return declarations;
};
