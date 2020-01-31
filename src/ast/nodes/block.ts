import {TokenStream}        from '../../tokenizer/token-stream';
import {parseDeclaration}   from '../internal';
import {maybe}              from '../tools/maybe';
import {Block, Declaration} from '../types';

export const parseBlock = maybe<Block>((stream: TokenStream) => {

    // It may be a block
    if (!stream.optional('punc', '{')) {
        return null;
    }

    // Parse declarations
    const declarations: Array<Declaration> = [];
    let decl: Declaration | null;

    do {
        decl = parseDeclaration(stream);

        if (decl) {
            declarations.push(decl);
        }
    } while (decl && !stream.match('punc', '}'));

    if (!declarations.length) {
        stream.throw('Expected a declaration.');
    }

    stream.expect('punc', '}');
    return {
        type: 'block',
        value: declarations
    } as Block;
});
