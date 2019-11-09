import {Block, Group, Reference}     from '../../ast/types';
import {Scope, ScopeEntry, ScopeKey} from '../types';


function resolveSingleReference(scope: Scope, target: string, needExport = false): Group | Block | null {
    let entry: ScopeEntry | null = scope.map.get(scope.current) || null;

    if (entry) {
        while (entry) {
            const resolved = entry.entries.find(v => v.name === target);

            if (resolved) {

                if (needExport && resolved.variant !== 'export') {
                    throw `Cannot access "${resolved.name}". Use the "export" keyword to make it accessible!`;
                }

                scope.current = entry.key || scope.globalKey;
                return resolved.value;
            } else if (entry) {
                entry = scope.map.get(entry.parent) || null;
            } else {
                entry = null;
            }
        }
    }

    return null;
}

export function resolveDefaultExport(scope: Scope, target: Block): Group | null {
    const defaultExport = target.value.find(v => v.variant === 'default');

    if (!defaultExport) {
        return null;
    }

    // Create sub-scope
    const newScopeKey: ScopeKey = Symbol('Subscope for a default export');
    const newScopeEntry: ScopeEntry = {
        entries: target.value,
        parent: scope.current,
        key: newScopeKey
    };

    scope.current = newScopeKey;
    scope.map.set(newScopeKey, newScopeEntry);

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
 * @param newScope
 * @param index
 */
export default function resolve(scope: Scope, target: Reference, index = 0): Group | null {
    const {value} = target;

    // Deep reference
    const part = value[index];
    const val = resolveSingleReference(scope, part, index > 0);

    if (!val) {
        throw `Failed to resolve "${part}"`;
    }

    if (val.type === 'block') {

        if (index + 1 === value.length) {
            return resolveDefaultExport(scope, val);
        }

        // Update scope
        const newScopeKey: ScopeKey = Symbol(`Subscope for ${part} (Part of ${value.join(':')})`);
        const newScopeEntry: ScopeEntry = {
            entries: val.value,
            parent: scope.current,
            key: newScopeKey
        };

        scope.current = newScopeKey;
        scope.map.set(newScopeKey, newScopeEntry);
        return resolve(scope, target, index + 1);
    } else if (val.type === 'group') {
        if (index + 1 === value.length) {
            return val;
        }
        throw `Reference "${part}" points to a group not a block.`;

    }

    return null;
}
