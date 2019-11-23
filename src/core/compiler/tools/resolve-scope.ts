import {Group, Container}                   from '../../ast/types';
import {Scope, ScopeEntriesMap, ScopeEntry} from '../types';
import {DEFAULT_EXPORT, EXPORTS}            from './create-scope';

/**
 * Resolves the default export in a scope
 * @param scope
 */
export function resolveDefaultExport(scope: Scope): [Scope, Group] {
    const defaultExport = scope.variants.get(DEFAULT_EXPORT);

    if (!defaultExport) {
        throw new Error('Missing default export.');
    }

    const {value, type} = defaultExport;
    if (type === 'scope') {
        return resolveDefaultExport(value as Scope);
    }
    return [scope, value as Group];

}

/**
 * Resolves a container in the given scope
 * @param scope
 * @param ref
 * @param offset
 */
export function resolveReference(scope: Scope, ref: Container, offset = 0): [Scope, Group] | null {
    const parts = ref.value;
    const lastItem = offset + 1 === parts.length;
    const targetName = ref.value[offset];
    let targetList: ScopeEntriesMap | null = null;

    // The first container (in <a:b:c> it's a) could be placed in a
    // Parent scope. Any deeper container need to be exported.
    if (offset) {
        const exportedMembers = scope.variants.get(EXPORTS);

        if (exportedMembers) {
            targetList = exportedMembers.value as ScopeEntriesMap;
        } else {
            throw new Error(`Type "${ref.value[offset - 1]}" does not export any types.`);
        }

    } else {
        targetList = scope.entries;
    }

    if (targetList.has(targetName)) {
        const res = targetList.get(targetName) as ScopeEntry;

        switch (res.type) {
            case 'scope': {
                if (lastItem) {
                    return resolveDefaultExport(res.value as Scope);
                }

                // Dive down
                return resolveReference(res.value as Scope, ref, offset + 1);

            }
            case 'value': {
                const val = res.value as Group;

                // The last item should be a group
                if (lastItem) {
                    return [scope, val];
                }

                throw new Error(`Reference "${targetName}" from "${parts.join(':')}" does not point to a block declaration.`);
            }
        }
    } else if (!offset && scope.parent) {

        // Bubble up
        return resolveReference(scope.parent, ref, offset);
    }

    return null;
}
