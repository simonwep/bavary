import {ConditionalStatement} from '../../ast/types';
import {evalBinaryExpression} from '../tools/eval-binary-expression';
import {isNullOrUndefined}    from '../tools/is-null-or-undefined';
import {lookupValue}          from '../tools/lookup-value';
import {ParserArgs}           from '../types';


module.exports = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<ConditionalStatement>
): boolean => {
    const parseGroup = require('./group');
    const {condition, then, alternative, negated} = decl;
    let conditionValue = false;

    switch (condition.type) {
        case 'binary-expression': {
            conditionValue = evalBinaryExpression(result, condition);
            break;
        }
        case 'value-accessor': {
            conditionValue = !isNullOrUndefined(
                lookupValue(result.obj, condition.value)
            );

            break;
        }
    }

    // Choose branch and take into account that the user may negate the value
    const branch = !conditionValue === negated ? then : alternative;

    // Branch not declared, that's fine
    if (!branch) {
        return true;
    }

    // Try to match branch
    const res = parseGroup({
        config,
        stream,
        scope,
        result,
        decl: branch
    });

    return res !== null;
};
