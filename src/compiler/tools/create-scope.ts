import {Declaration}                                                                from '../../ast/types';
import {Scope, ScopeEntriesMap, ScopeEntryKey, ScopeEntryVariant, ScopeVariantsMap} from '../types';

export const GLOBAL_SCOPE = Symbol('Global scope');
export const DEFAULT_EXPORT = Symbol('Default export');
export const ENTRY_EXPORT = Symbol('Entry type');
export const EXPORTS = Symbol('Exported types');

/**
 * Creates a new scope
 * @param parent
 * @param key
 */
export function createScopeEntry(parent: Scope, key: ScopeEntryKey): Scope {
    return {
        variants: new Map() as ScopeVariantsMap,
        entries: new Map() as ScopeEntriesMap,
        parent,
        key
    } as Scope;
}

/**
 * TODO: minimize a bit
 * Resolves a scope with given declarations
 * @param decs
 * @param current
 */
export function createScope(decs: Array<Declaration>, current: Scope): Scope {
    const {entries, variants, key} = current;

    for (const dec of decs) {
        const {value, name} = dec;

        switch (dec.variant) {
            case 'default': {

                // Validate
                if (key === GLOBAL_SCOPE) {
                    throw new Error('The global scope cannot held default exports.');
                } else if (variants.has(DEFAULT_EXPORT)) {
                    throw new Error('There\'s already a default export.');
                }

                if (value.type === 'group') {

                    // Save default export
                    variants.set(DEFAULT_EXPORT, {
                        type: 'value',
                        value
                    });
                } else {
                    const subScope = createScopeEntry(current, DEFAULT_EXPORT);

                    // Save default export and resolve sub-entries
                    variants.set(DEFAULT_EXPORT, {
                        type: 'scope',
                        value: createScope(value.value, subScope)
                    });
                }

                break;
            }
            case 'entry': {

                // Validate
                if (key !== GLOBAL_SCOPE) {
                    throw new Error('Only the global scope can have an entry.');
                } else if (variants.has(ENTRY_EXPORT)) {
                    throw new Error('There\'s already an entry defined.');
                }

                if (value.type === 'group') {

                    // Save default export
                    variants.set(ENTRY_EXPORT, {
                        type: 'value',
                        value
                    });
                } else {
                    const subScope = createScopeEntry(current, ENTRY_EXPORT);

                    // Save entry export and resolve sub-entries
                    variants.set(ENTRY_EXPORT, {
                        type: 'scope',
                        value: createScope(value.value, subScope)
                    });
                }

                break;
            }
            case 'export': {

                // Validate
                if (key === GLOBAL_SCOPE) {
                    throw new Error('The global scope cannot export types.');
                } else if (!name) {
                    throw new Error('Exported members must have a name.');
                } else if (!variants.has(EXPORTS)) {
                    variants.set(EXPORTS, {
                        type: 'entries',
                        value: new Map() as ScopeEntriesMap
                    });
                }

                const exportedMembers = (
                    variants.get(EXPORTS) as ScopeEntryVariant
                ).value as ScopeEntriesMap;

                if (value.type === 'group') {

                    // Save export
                    exportedMembers.set(name, {
                        type: 'value',
                        value
                    });
                } else {
                    const subScope = createScopeEntry(current, name);

                    // Save export and resolve sub-entries
                    exportedMembers.set(name, {
                        type: 'scope',
                        value: createScope(value.value, subScope)
                    });
                }

                break;
            }
        }


        // It may have a name
        if (name) {

            // Prevent re-using the same name multiple times
            if (entries.has(name)) {
                throw new Error(`There's already a type named ${name}`);
            }

            if (value.type === 'group') {

                // Save entrie
                entries.set(name, {
                    type: 'value',
                    value
                });
            } else {
                const subScope = createScopeEntry(current, name);

                // Save entrie and resolve sub-entries
                entries.set(name, {
                    type: 'scope',
                    value: createScope(value.value, subScope)
                });
            }
        }
    }

    return current;
}
