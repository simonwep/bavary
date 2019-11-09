import {Block, Declaration, Group, Reference} from '../../ast/types';
import {Scope, ScopeEntry, ScopeKey}          from '../types';

/**
 * Extends a scope
 * @param scope
 * @param entries
 * @param description
 */
function extendScope(scope: Scope, entries: Array<Declaration>, description?: string): void {

    // Create sub-scope
    const newScopeKey: ScopeKey = Symbol(description);
    const newScopeEntry: ScopeEntry = {
        entries,
        parent: scope.current,
        key: newScopeKey
    };

    scope.current = newScopeKey;
    scope.map.set(newScopeKey, newScopeEntry);
}

/**
 * Resolves a type in the current scope
 * @param scope
 * @param target
 * @param needExport
 */
function resolveSingleReference(scope: Scope, target: string, needExport = false): Group | Block | null {
    let entry: ScopeEntry | null = scope.map.get(scope.current) || null;

    if (entry) {
        while (entry) {
            const resolved = entry.entries.find(v => v.name === target);

            if (resolved) {

                if (needExport && resolved.variant !== 'export') {
                    throw new Error(`Cannot access "${resolved.name}". Use the "export" keyword to make it accessible!`);
                }

                scope.current = entry.key || scope.globalKey;
                return resolved.value;
            } else if (entry) {

                // Runtime garbage collection
                scope.map.delete(entry.key);

                // Bubble up
                entry = scope.map.get(entry.parent) || null;
            } else {
                entry = null;
            }
        }
    }

    return null;
}

/**
 * Resolves a default export
 * @param scope
 * @param target
 */
export function resolveDefaultExport(scope: Scope, target: Block): Group | null {
    const defaultExport = target.value.find(v => v.variant === 'default');

    if (!defaultExport) {
        return null;
    }

    // Extend anonymous scope
    extendScope(scope, target.value, 'Subscope for a default export');

    // Resolve default in nested block or return group
    const {value} = defaultExport;
    if (value.type === 'block') {
        return resolveDefaultExport(scope, value);
    }

    return value;
}

/**
 * Recursively resolves a reference and the corresponding scope.
 * @param scope
 * @param target
 * @param index
 */
export default function resolve(scope: Scope, target: Reference, index = 0): Group | null {
    const {value} = target;

    // Deep reference
    const part = value[index];
    const val = resolveSingleReference(scope, part, index > 0);

    if (!val) {
        throw new Error(`Failed to resolve "${part}"`);
    }

    if (val.type === 'block') {

        if (index + 1 === value.length) {
            return resolveDefaultExport(scope, val);
        }

        // Extend scope
        extendScope(scope, val.value, `Subscope for ${part} (Part of ${value.join(':')})`);
        return resolve(scope, target, index + 1);
    } else if (val.type === 'group') {
        if (index + 1 === value.length) {
            return val;
        }
        throw new Error(`Reference "${part}" points to a group not a block.`);

    }

    return null;
}
