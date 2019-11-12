import parseAst                                   from '../ast';
import {Group}                                    from '../ast/types';
import Streamable                                 from '../stream';
import {createScope, ENTRY_EXPORT, GLOBAL_SCOPE}  from './tools/create-scope';
import {resolveDefaultExport}                     from './tools/resolve-scope';
import {Scope, ScopeEntriesMap, ScopeVariantsMap} from './types';

export default (definitions: string): (content: string) => null | object => {
    const group = require('./parser/group');
    const tree = parseAst(definitions);

    // Resolve sub-scopes
    const globalScope = createScope(tree, {
        variants: new Map() as ScopeVariantsMap,
        entries: new Map() as ScopeEntriesMap,
        parent: null,
        key: GLOBAL_SCOPE,
    });

    const entry = globalScope.variants.get(ENTRY_EXPORT);

    // Check if entry node is declared
    if (!entry) {
        throw new Error('Couldn\'t resolve entry type. Use the entry keyword to declare one.');
    }

    let entryGroup: Group | null = null;
    let entryScope: Scope | null = null;

    if (entry.type === 'scope') {
        [entryScope, entryGroup] = resolveDefaultExport(entry.value as Scope);
    } else {
        entryGroup = entry.value as Group;
        entryScope = globalScope;
    }

    return (content: string): null | object => {

        // Parse and return result if successful
        const stream = new Streamable(content);
        const res = group(stream, entryGroup, entryScope);
        return stream.hasNext() ? null : res;
    };
};
