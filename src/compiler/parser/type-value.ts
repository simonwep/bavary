import {ASTNode, Block, Group} from '../../ast/types';
import Streamable              from '../../stream';
import {ParsingResult, Scope}  from '../types';

module.exports = (stream: Streamable<string>, decl: ASTNode, scope: Scope, result?: ParsingResult): Group | Block => {
    const block = require('./block');
    const group = require('./group');

    switch (decl.type) {
        case 'group': {
            return group(stream, decl as Group, scope, result);
        }
        case 'block': {
            return block(stream, decl as Block, scope);
        }
        default: {
            throw new Error(`Unknown declaration type "${decl.type}"`);
        }
    }
};
