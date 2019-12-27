import {ConditionalStatement}      from '../../ast/types';
import {evalGroup}                 from '../internal';
import {evalBinaryExpression}      from '../tools/eval-binary-expression';
import {ParserArgs, ParsingResult} from '../types';

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
    const conditionValue = evalBinaryExpression((result as ParsingResult), condition);

    // Choose branch and take into account that the user may negate the value
    const branch = conditionValue ? consequent : alternate;

    // Branch not declared, that's fine
    if (!branch) {
        return true;
    }

    // Try to match branch
    let res;

    // TODO: Simplify that
    if (branch.type === 'group') {
        res = evalGroup({
            config,
            stream,
            scope,
            result,
            decl: branch
        });
    } else {
        res = evalConditionalStatement({
            config,
            stream,
            scope,
            result,
            decl: branch
        });
    }

    return res !== null && res !== false;
};
