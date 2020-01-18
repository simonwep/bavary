import {ConditionalStatement, Group} from '../../ast/types';
import {evalGroup}                   from '../internal';
import {evalBinaryExpression}        from '../tools/eval-binary-expression';
import {ParserArgs}                  from '../types';
import {StatementOutcome}            from './statement-outcome';

export const evalConditionalStatement = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<ConditionalStatement>
): StatementOutcome => {
    const {condition, consequent, alternate} = decl;
    const conditionValue = evalBinaryExpression(result, condition);

    // Choose branch and take into account that the user may negate the value
    const branch = conditionValue ? consequent : alternate;

    // Execute branch only if declared
    if (branch) {

        // Try to match branch
        const res = (branch.type === 'group' ? evalGroup : evalConditionalStatement)({
            config,
            stream,
            scope,
            result,
            decl: branch as (Group & ConditionalStatement)
        });


        if (res === null || res === StatementOutcome.FAILED) {
            return StatementOutcome.FAILED;
        } else if (res === StatementOutcome.RETURN) {
            return res;
        }
    }

    return StatementOutcome.OK;
};
