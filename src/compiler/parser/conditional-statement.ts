import {ConditionalStatement, Group} from '../../ast/types';
import {evalGroup}                   from '../internal';
import {evalBinaryExpression}        from '../tools/eval-binary-expression';
import {ParserArgs}                  from '../types';

export const evalConditionalStatement = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<ConditionalStatement>
): boolean => {
    const {condition, consequent, alternate} = decl;
    const conditionValue = evalBinaryExpression({
        config,
        stream,
        decl: condition,
        scope,
        result
    });

    // Choose branch and take into account that the user may negate the value
    const branch = conditionValue ? consequent : alternate;

    // Branch not declared, that's fine
    if (!branch) {
        return true;
    }

    // Try to match branch
    const res = (branch.type === 'group' ? evalGroup : evalConditionalStatement)({
        config,
        stream,
        scope,
        result,
        decl: branch as (Group & ConditionalStatement)
    });

    return res !== null && res !== false;
};
