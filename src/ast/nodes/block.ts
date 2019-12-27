import {declaration}        from '../internal';
import {check}              from '../tools/check';
import {expect}             from '../tools/expect';
import {maybe}              from '../tools/maybe';
import {optional}           from '../tools/optional';
import {Block, Declaration} from '../types';

export const block = maybe<Block>(stream => {

    // It may be a block
    if (!optional(stream, false, 'punc', '{')) {
        return null;
    }

    // Parse declarations
    const declarations: Array<Declaration> = [];

    while (!check(stream, false, 'punc', '}')) {

        // TODO: let decl be nullable
        declarations.push(declaration(stream) as Declaration);
    }

    expect(stream, false, 'punc', '}');
    return {
        type: 'block',
        value: declarations
    } as Block;
});
