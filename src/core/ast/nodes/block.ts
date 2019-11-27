import {check}              from '../tools/check';
import {expect}             from '../tools/expect';
import {maybe}              from '../tools/maybe';
import {optional}           from '../tools/optional';
import {Block, Declaration} from '../types';

module.exports = maybe<Block>(stream => {
    const declaration = require('./declaration');

    // It may be a block
    if (!optional(stream, 'punc', '{')) {
        return null;
    }

    // Parse declarations
    const declarations: Array<Declaration> = [];

    while (!check(stream, 'punc', '}')) {
        declarations.push(declaration(stream));
    }

    expect(stream, 'punc', '}');
    return {
        type: 'block',
        value: declarations
    } as Block;
});
