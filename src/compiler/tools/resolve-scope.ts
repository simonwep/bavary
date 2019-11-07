import {Declaration} from '../../ast/types';
import {Scope}       from '../types';

function resolveExports(decs: Array<Declaration>, map: Scope, base: string | null): void {
    for (const {variant, name, value} of decs) {
        const subName = `${base}:${name}`;

        if (map.has(subName)) {
            throw `Type "${subName}" is already declared in the scope of "${name}".`;
        }
        if (variant === 'export') {
            map.set(subName, value);
        }

        // If it's a block it may also export additional types
        if (value.type === 'block') {
            resolveExports(value.value, map, subName);
        }
    }
}

/**
 * Builds a new scope and resolves all exports
 * @param decs Declarations
 * @param parent Optional inherited scope
 * @param interceptor Optional interceptor for each declaration
 */
export default (decs: Array<Declaration>, parent: Scope | null, interceptor: (arg: Declaration) => void): Scope => {
    const map = new Map(parent !== null ? [...parent] : null) as Scope;

    // TODO: Types are not properly scoped!
    for (const dec of decs) {
        const {name, value, type} = dec;

        // Each declaration can only one get once defined
        if (map.has(name)) {
            throw `Type "${name}" has been already declared.`;
        } else if (type === 'declaration') {

            // Call interceptor if defined
            if (typeof interceptor === 'function') {
                interceptor(dec);
            }

            // Check if declaration isn't anonym
            if (name !== null) {
                map.set(name, value);
            }
        } else {
            throw `Unknown type "${type}"`;
        }

        // If the value is a block it may export types
        if (value.type === 'block') {
            resolveExports(value.value, map, name);
        }
    }

    return map;
};
