import parseAst                      from '../ast';
import {Block, Declaration, Group}   from '../ast/types';
import Streamable                    from '../stream';
import {Scope, ScopeEntry, ScopeKey} from './types';

export default (definitions: string): (content: string) => null | object => {
    const typeValue = require('./parser/type-value');
    const tree = parseAst(definitions);

    if (!tree) {
        throw 'Failed to parse declarations.';
    }

    // Resolve entry-scope and find entry node
    let entry: Block | Group | null = null;
    const globalScopeKey = Symbol('global scope');
    const globals: Array<Declaration> = [];
    const scopeMap: Map<ScopeKey, ScopeEntry> = new Map();

    for (const dec of tree) {
        if (dec.variant === 'entry') {

            if (entry) {
                throw 'There can only be one entry type.';
            }

            entry = dec.value;
        }

        // Skip anonymous declarations
        if (dec.name) {

            // Check if name was aready used
            if (globals.find(v => v.name === dec.name)) {
                throw `"${dec.name}" was already declared.`;
            }

            globals.push(dec);
        }
    }

    // Check if entry node is declared
    if (!entry) {
        throw 'Couldn\'t resolveScope entry type. Use the entry keyword to declare one.';
    }

    // Insert global scope
    scopeMap.set(globalScopeKey, {
        entries: globals,
        parent: null,
        key: globalScopeKey
    });

    const scope: Scope = {
        globalKey: globalScopeKey,
        current: globalScopeKey,
        map: scopeMap,
        locals: []
    };

    return (content: string): null | object => {
        const stream = new Streamable(content);
        const res = typeValue(stream, entry, scope);
        return stream.hasNext() ? null : res;
    };
};
