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
        node
    }: ParserArgs<ConditionalStatement>
): boolean => {
    const {condition, consequent, alternate} = decl;
    const conditionValue = evalBinaryExpression(node, condition);

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
        node,
        decl: branch as (Group & ConditionalStatement)
    });

    return res !== null && res !== false;
};
