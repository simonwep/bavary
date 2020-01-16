import {DefineStatement}                from '../../../ast/types';
import {evalLiteral}                    from '../../tools/eval-literal';
import {lookupValue}                    from '../../tools/lookup-value';
import {ParserArgs, ParsingResultValue} from '../../types';
import {evalGroup}                      from '../group';

export const evalDefineCommand = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<DefineStatement>
): boolean => {

    // Define only works on object-groups
    if (result.type !== 'object') {
        throw new Error('Can\'t use define within arrays or strings.');
    }

    const {value} = decl;
    if (value.type === 'literal') {
        result.value[decl.name] = evalLiteral(result, value);
    } else if (value.type === 'value-accessor') {
        result.value[decl.name] = lookupValue(result.value, value.value) as ParsingResultValue;
    } else {
        const res = evalGroup({
            decl: value,
            scope,
            config,
            stream
        });

        if (res !== null) {
            result.value[decl.name] = res;
        } else {
            return value.multiplier?.type === 'optional';
        }
    }

    return true;
};
