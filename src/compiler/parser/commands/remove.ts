import {RemoveStatement}      from '../../../ast/types';
import {REMOVED_PROPERTY}     from '../../internal';
import {ObjectNodeValue}      from '../../node';
import {evalMemberExpression} from '../../tools/eval-member-expression';
import {ParserArgs}           from '../../types';

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
    const parent = evalMemberExpression(node.value, pathCopy);

    if (Array.isArray(parent) && typeof topAccessor === 'number') {

        // Arrays won't get serialized
        parent.splice(topAccessor, 1);
    } else if (!pathCopy.length) {

        // Top-level properties will be serialzed, mark them that they shall be removed
        (parent as ObjectNodeValue)[topAccessor] = REMOVED_PROPERTY;
    } else if (typeof parent === 'object') {

        // Deeply nested properties won't be serialized, remove them immediatly
        delete (parent as ObjectNodeValue)[topAccessor];
    }

    return true;
};
