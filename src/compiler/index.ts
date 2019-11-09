import parseAst                      from '../ast';
import {Block, Declaration, Group}   from '../ast/types';
import Streamable                    from '../stream';
import {Scope, ScopeEntry, ScopeKey} from './types';

export default (definitions: string): (content: string) => null | object => {
    const typeValue = require('./parser/type-value');
    const tree = parseAst(definitions);

    if (!tree) {
        throw new Error('Failed to parse declarations.');
    }

    // Resolve entry-scope and find entry node
    let entry: Block | Group | null = null;
    const globalScopeKey = Symbol('global scope');
    const globals: Array<Declaration> = [];

    for (const dec of tree) {
        if (dec.variant === 'entry') {

            if (entry) {
                throw new Error('There can only be one entry type.');
            }

            entry = dec.value;
        }

        // Skip anonymous declarations
        if (dec.name) {

            // Check if name was aready used
            if (globals.find(v => v.name === dec.name)) {
                throw new Error(`"${dec.name}" was already declared.`);
            }

            globals.push(dec);
        }
    }

    // Check if entry node is declared
    if (!entry) {
        throw new Error('Couldn\'t resolveScope entry type. Use the entry keyword to declare one.');
    }

    const globalScopeEntry: ScopeEntry = {
        entries: globals,
        parent: null,
        key: globalScopeKey
    };

    return (content: string): null | object => {

        // Set-up scope
        const scope: Scope = {
            globalKey: globalScopeKey,
            current: globalScopeKey,
            map: new Map<ScopeKey, ScopeEntry>([[globalScopeKey, globalScopeEntry]]),
            locals: []
        };

        // Parse and return result if successful
        const stream = new Streamable(content);
        const res = typeValue(stream, entry, scope);
        return stream.hasNext() ? null : res;
    };
};
