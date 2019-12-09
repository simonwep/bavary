import {Declaration}                                                                            from '../../ast/types';
import {Scope, ScopeEntriesMap, ScopeEntry, ScopeEntryKey, ScopeEntryVariant, ScopeVariantsMap} from '../types';

export const GLOBAL_SCOPE = Symbol('Global scope');
export const DEFAULT_EXPORT = Symbol('Default export');
export const ENTRY_EXPORT = Symbol('Entry type');
export const EXPORTS = Symbol('Exported types');

/**
 * Resolves a scope with given declarations
 * @param decs
 * @param current
 */
export function createScope(decs: Array<Declaration>, current: Scope): Scope {
    const {entries, variants, key} = current;

    /**
     * Registers a value into the current scope
     * @param value
     * @param target
     * @param key
     */
    function register(
        value: Declaration,
        target: Map<ScopeEntryKey, ScopeEntry | ScopeEntryVariant>,
        key: ScopeEntryKey
    ): void {
        if (value.value.type === 'group') {

            target.set(key as string, {
                type: 'value',
                value
            });
        } else {

            // Create sub-scope with current scope as parent and key as key
            const subScope = {
                variants: new Map() as ScopeVariantsMap,
                entries: new Map() as ScopeEntriesMap,
                parent: current,
                key
            } as Scope;

            target.set(key, {
                type: 'scope',
                value: createScope(value.value.value, subScope) // Declaration.block.value
            });
        }
    }

    for (const dec of decs) {
        const {name} = dec;

        switch (dec.variant) {
            case 'default': {

                // Validate
                if (key === GLOBAL_SCOPE) {
                    throw new Error('The global scope cannot held default exports.');
                } else if (variants.has(DEFAULT_EXPORT)) {
                    throw new Error('There\'s already a default export.');
                }

                register(dec, variants, DEFAULT_EXPORT);
                break;
            }
            case 'entry': {

                // Validate
                if (key !== GLOBAL_SCOPE) {
                    throw new Error('Only the global scope can have an entry.');
                } else if (variants.has(ENTRY_EXPORT)) {
                    throw new Error('There\'s already an entry defined.');
                }

                register(dec, variants, ENTRY_EXPORT);
                break;
            }
            case 'export': {

                // Validate
                if (key === GLOBAL_SCOPE) {
                    throw new Error('The global scope cannot export types.');
                }

                if (!variants.has(EXPORTS)) {
                    variants.set(EXPORTS, {
                        type: 'entries',
                        value: new Map() as ScopeEntriesMap
                    });
                }

                // Resolve export map
                const exportedMembers = (
                    variants.get(EXPORTS) as ScopeEntryVariant
                ).value as ScopeEntriesMap;

                register(dec, exportedMembers, name as string); // Identifiers of types cannot be empty
                break;
            }
        }


        // It may have a name
        if (name) {

            // Prevent re-using the same name multiple times
            if (entries.has(name)) {
                throw new Error(`There's already a type named ${name}`);
            }

            register(dec, entries, name);
        }
    }

    return current;
}
