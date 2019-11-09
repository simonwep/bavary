import {Block, Group}         from '../../ast/types';
import Streamable             from '../../stream';
import {resolveDefaultExport} from '../tools/scope';
import {Scope}                from '../types';

module.exports = (stream: Streamable<string>, decl: Block, scope: Scope): Group => {
    const group = require('./group');

    // Resolve target
    const defaultExport = resolveDefaultExport(scope, decl);

    if (!defaultExport) {
        throw new Error('Missing default export.');
    }

    return group(stream, defaultExport, scope);
};
