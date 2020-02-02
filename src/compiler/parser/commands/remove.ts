import {RemoveStatement}  from '../../../ast/types';
import {REMOVED_PROPERTY} from '../../internal';
import {ObjectNodeValue}  from '../../node';
import {ParserArgs}       from '../../types';

export const evalRemoveCommand = (
    {
        decl,
        node
    }: ParserArgs<RemoveStatement>
): boolean => {

    // Remove dosn't work on strings
    if (node.type === 'string') {
        throw new Error('Can\'t use rem on strings.');
    }

    // Lookup parent
    const pathCopy = [...decl.value.value];
    const topAccessor = pathCopy.pop() as string | number;
    const parent = node.lookup(pathCopy) as ObjectNodeValue | undefined | Array<unknown>;

    // Skip unresolved parents
    if (!parent) {
        return true;
    }

    if (Array.isArray(parent)) {

        if (typeof topAccessor === 'number') {

            // Remove item
            parent.splice(topAccessor, 1);
        }

    } else if (typeof parent === 'object' && parent[topAccessor] !== undefined) {

        // Check if it's a deeply-nested property
        if (pathCopy.length) {

            // Deeply nested properties won't be serialized, remove them immediatly
            delete parent[topAccessor];
        } else {
            // Top-level properties will be serialzed, mark them that they shall be removed
            parent[topAccessor] = REMOVED_PROPERTY;
        }
    }

    return true;
};
