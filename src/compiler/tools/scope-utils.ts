import {Declaration, DeclarationValue, Reference} from '../../ast/types';
import {Scope, ScopeEntriesMap, ScopeEntry}       from '../types';
import {DEFAULT_EXPORT, EXPORTS}                  from './create-scope';

/**
 * Resolves the default export in a scope
 * @param scope
 */
export function resolveDefaultExport(scope: Scope): [Scope, Declaration] {
    const defaultExport = scope.variants.get(DEFAULT_EXPORT);

    if (!defaultExport) {
        throw new Error('Missing default export.');
    }

    const {value, type} = defaultExport;
    if (type === 'scope') {
        return resolveDefaultExport(value as Scope);
    }

    return [scope, defaultExport.value as Declaration];
}

/**
 * Injects a value into a scope
 * @param scope Target scope
 * @param name Referece name
 * @param value Declaration value
 */
export function injectDeclaration(scope: Scope, name: string, value: DeclarationValue): void {
    const {entries} = scope;

    entries.set(name, {

        // We inject an actual value
        type: 'value',

        // Synthetically craft a declaration
        value: {
            type: 'declaration',
            arguments: null,
            variant: null,
            value,
            name,
        } as Declaration
    });
}

/**
 * Resolves a reference in the given scope
 * @param scope
 * @param ref
 * @param offset
 */
export function resolveReference(scope: Scope, ref: Reference, offset = 0): [Scope, Declaration] | null {
    const parts = ref.value;
    const lastItem = offset + 1 === parts.length;
    const targetName = ref.value[offset];
    let targetList: ScopeEntriesMap | null = null;

    // The first reference (in <a:b:c> it's a) could be placed in a
    // Parent scope. Any deeper reference need to be exported.
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

                // The last item should be a group
                if (lastItem) {
                    return [scope, res.value as Declaration];
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
