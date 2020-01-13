import {RemoveStatement}                      from '../../../ast/types';
import {REMOVED_PROPERTY}                     from '../../internal';
import {lookupValue}                          from '../../tools/lookup-value';
import {ParserArgs, ParsingResultObjectKVSet} from '../../types';

export const evalRemoveCommand = (
    {
        decl,
        result
    }: ParserArgs<RemoveStatement>
): boolean => {

    // Remove dosn't work on strings
    if (result.type === 'string') {
        throw new Error('Can\'t use rem on strings.');
    }

    // Lookup parent
    const pathCopy = [...decl.value.value];
    const topAccessor = pathCopy.pop() as string | number;
    const parent = lookupValue(result.value, pathCopy);

    if (Array.isArray(parent) && typeof topAccessor === 'number') {

        // Arrays won't get serialized
        parent.splice(topAccessor, 1);
    } else if (!pathCopy.length) {

        // Top-level properties will be serialzed, mark them that they shall be removed
        (parent as ParsingResultObjectKVSet)[topAccessor] = REMOVED_PROPERTY;
    } else if (typeof parent === 'object') {

        // Deeply nested properties won't be serialized, remove them immediatly
        delete (parent as ParsingResultObjectKVSet)[topAccessor];
    }

    return true;
};
