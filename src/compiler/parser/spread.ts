import {Group, Reference, Spread}       from '../../ast/types';
import {evalGroup, evalRawReference}    from '../internal';
import {typeOf}                         from '../tools/type-of';
import {ParserArgs, ParsingResultValue} from '../types';
import {StatementOutcome}               from './statement-outcome';

export const evalSpread = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Spread>
): StatementOutcome => {

    // Execute value
    const value = (decl.value.type === 'reference' ? evalRawReference : evalGroup)({
        config, stream, scope,
        decl: decl.value as Reference & Group
    });

    if (!value) {
        return StatementOutcome.FAILED;
    }

    const valueType = typeOf(value);

    // Validate both sides
    if (result.type === 'string') {
        throw new Error('Cannot use spread-operator in strings.');
    }

    /**
     * Join objects / arrays. Otherwise throw error because of incompatibility
     */
    if ((valueType === 'array' || valueType === 'string') && result.type === 'array') {
        result.value.push(...(value as Array<ParsingResultValue>));
    } else if (valueType === 'object' && result.type === 'array') {
        result.value.push(...Object.entries(value));
    } else if (valueType === 'object' && result.type === 'object') {
        Object.assign(result.value, value);
    } else {
        throw new Error(`Incompatible types used in spread operator: ${valueType} ≠ ${result.type}`);
    }

    return StatementOutcome.OK;
};
