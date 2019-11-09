import {Block, Group}         from '../../ast/types';
import Streamable             from '../../stream';
import {resolveDefaultExport} from '../tools/resolve-scope';
import {Scope}                from '../types';

module.exports = (stream: Streamable<string>, decl: Block, scope: Scope): Group => {
    const group = require('./group'); // TODO: Fix messed up circular dependencies

    // Resolve target
    const defaultExport = resolveDefaultExport(scope, decl);

    if (!defaultExport) {
        throw 'Missing default export.';
    }

    return group(stream, defaultExport, scope);
};
