import {Block, DeclarationValue, Group} from '../../ast/types';
import Streamable                       from '../../stream';
import resolveScope                     from '../tools/resolve-scope';
import {Scope}                          from '../types';

module.exports = (stream: Streamable<string>, decl: Block, scope: Scope): Group => {
    const group = require('./group'); // TODO: Fix messed up circular dependencies

    // Inherit current scope
    let def: null | DeclarationValue = null;
    const newScope = resolveScope(decl.value, scope, ({variant, value}) => {
        if (variant === 'default') {
            if (def !== null) {
                throw 'There can only be one default export.';
            }

            def = value;
        } else if (variant === 'entry') {
            throw 'The entry type needs to be in the global scope.';
        }
    });

    if (!def) {
        throw 'Missing default export.';
    }

    return group(stream, def, newScope);
};
