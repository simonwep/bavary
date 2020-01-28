import {TokenStream}        from '../../tokenizer/token-stream';
import {parseDeclaration}   from '../internal';
import {maybe}              from '../tools/maybe';
import {Block, Declaration} from '../types';

export const parseBlock = maybe<Block>((stream: TokenStream) => {

    // It may be a block
    if (!stream.optional(false, 'punc', '{')) {
        return null;
    }

    // Parse declarations
    const declarations: Array<Declaration> = [];
    let decl: Declaration;

    do {
        decl = parseDeclaration(stream) as Declaration;

        if (decl) {
            declarations.push(decl);
        }
    } while (decl && !stream.match(false, 'punc', '}'));

    if (!declarations.length) {
        stream.throw('Expected a declaration.');
    }

    stream.expect(false, 'punc', '}');
    return {
        type: 'block',
        value: declarations
    } as Block;
});
