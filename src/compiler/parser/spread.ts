import {Group, Reference, Spread}    from '../../ast/types';
import {evalGroup, evalRawReference} from '../internal';
import {ArrayNodeValue, NodeValue}   from '../node';
import {typeOf}                      from '../tools/type-of';
import {ParserArgs}                  from '../types';

export const evalSpread = (
    {
        config,
        stream,
        decl,
        scope,
        node
    }: ParserArgs<Spread>
): boolean => {

    // Execute value
    // TODO: Add node in case of a group
    const value = (decl.value.type === 'reference' ? evalRawReference : evalGroup)({
        config, stream, scope,
        decl: decl.value as Reference & Group
    });

    if (!value) {
        return false;
    }

    const valueType = typeOf(value);

    // Validate both sides
    if (node.type === 'string') {
        throw new Error('Cannot use spread-operator in strings.');
    }

    /**
     * Join objects / arrays. Otherwise throw error because of incompatibility
     */
    if ((valueType === 'array' || valueType === 'string') && node.type === 'array') {
        node.value.push(...(value as Array<NodeValue>));
    } else if (valueType === 'object' && node.type === 'array') {
        node.value.push(...(Object.entries(value) as ArrayNodeValue));
    } else if (valueType === 'object' && node.type === 'object') {
        Object.assign(node.value, value);
    } else {
        throw new Error(`Incompatible types used in spread operator: ${valueType} ≠ ${node.type}`);
    }

    return true;
};
