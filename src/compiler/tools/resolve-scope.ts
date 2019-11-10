import {Group, Reference}  from '../../ast/types';
import {Scope, ScopeEntry} from '../types';
import {DEFAULT_EXPORT}    from './create-scope';


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
 * Resolves a reference in the given scope
 * @param scope
 * @param ref
 * @param offset
 */
export function resolveReference(scope: Scope, ref: Reference, offset = 0): [Scope, Group] | null {
    const lastItem = offset + 1 === ref.value.length;
    const targetName = ref.value[offset];

    if (scope.entries.has(targetName)) {
        const res = scope.entries.get(targetName) as ScopeEntry;

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

                throw new Error(`Type "${val.value}" is not a block declaration.`);
            }
        }
    } else if (!offset && scope.parent) {

        // Bubble up
        return resolveReference(scope.parent, ref, offset);
    }

    return null;
}
