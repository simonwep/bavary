import {DefineStatement}                from '../../../ast/types';
import {evalLiteral}                    from '../../tools/eval-literal';
import {lookupValue}                    from '../../tools/lookup-value';
import {ParserArgs, ParsingResultValue} from '../../types';
import {evalGroup}                      from '../group';
import {StatementOutcome}               from '../statement-outcome';

export const evalDefineCommand = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<DefineStatement>
): StatementOutcome => {

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
            result.value[decl.name] = Array.isArray(res) ? res : res.value;
        } else if (value.multiplier?.type !== 'optional') {
            return StatementOutcome.FAILED;
        }
    }

    return StatementOutcome.OK;
};
