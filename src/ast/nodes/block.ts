import {parseDeclaration}   from '../internal';
import {check}              from '../tools/check';
import {expect}             from '../tools/expect';
import {maybe}              from '../tools/maybe';
import {optional}           from '../tools/optional';
import {Block, Declaration} from '../types';

export const parseBlock = maybe<Block>(stream => {

    // It may be a block
    if (!optional(stream, false, 'punc', '{')) {
        return null;
    }

    // Parse declarations
    const declarations: Array<Declaration> = [];

    while (!check(stream, false, 'punc', '}')) {
        declarations.push(parseDeclaration(stream) as Declaration);
    }

    expect(stream, false, 'punc', '}');
    return {
        type: 'block',
        value: declarations
    } as Block;
});
