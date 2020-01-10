import {Group, Reference, Spread}       from '../../ast/types';
import {evalGroup, evalRawReference}    from '../internal';
import {typeOf}                         from '../tools/type-of';
import {ParserArgs, ParsingResultValue} from '../types';

export const evalSpread = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Spread>
): boolean => {

    // Execute value
    const value = (decl.value.type === 'reference' ? evalRawReference : evalGroup)({
        config, stream, scope,
        decl: decl.value as Reference & Group
    });

    if (!value) {
        return false;
    }

    const valueType = typeOf(value);

    // Validate both sides
    if (valueType === 'string') {
        throw new Error(`"${decl.value}" doesn't return a object or array which is required for the spread operator to work.`);
    } else if (result.type === 'string') {
        throw new Error('Cannot use spread-operator in strings.');
    }

    /**
     * Join objects / arrays. Otherwise throw error because of incompatibility
     */
    if (valueType === 'array' && result.type === 'array') {
        result.value.push(...(value as Array<ParsingResultValue>));
    } else if (valueType === 'object' && result.type === 'object') {
        Object.assign(result.value, value);
    } else {
        throw new Error(`Incompatible types used in spread operator: ${valueType} ≠ ${result.type}`);
    }

    return true;
};
