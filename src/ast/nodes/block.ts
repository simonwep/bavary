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

    while (!stream.match(false, 'punc', '}')) {
        declarations.push(parseDeclaration(stream) as Declaration);
    }

    stream.expect(false, 'punc', '}');
    return {
        type: 'block',
        value: declarations
    } as Block;
});
