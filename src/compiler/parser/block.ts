import {Block, Group}         from '../../ast/types';
import Streamable             from '../../stream';
import {resolveDefaultExport} from '../tools/resolve-scope';
import {Scope}                from '../types';

module.exports = (stream: Streamable<string>, decl: Block, scope: Scope): Group => {
    const group = require('./group');

    // Resolve target
    const result = resolveDefaultExport(scope);

    if (!result) {
        throw new Error('Missing default export.');
    }

    const [newScope, targetGroup] = result;
    return group(stream, targetGroup, newScope);
};
