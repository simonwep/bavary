import {TokenStream}      from '../tokenizer/token-stream';
import {Token}            from '../tokenizer/types';
import {parseGroup}       from './internal';
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

    // Parse as many declarations as possible
    while (stream.hasNext()) {
        const dec = parseDeclaration(stream);

        if (!dec) {
            break;
        }

        declarations.push(dec);
    }


    /**
     * In case no declarations were successfully parsed the user may
     * have used a group as only entry value.
     */
    if (!declarations.length) {
        const group = parseGroup(stream);

        if (group) {
            declarations.push({
                type: 'declaration',
                value: group,
                variant: 'entry',
                arguments: null,
                name: null
            });
        }
    }

    // Throw error if tokens were left unparsed
    if (stream.hasNext()) {
        stream.throw('Unexpected token');
    }

    return declarations;
};
