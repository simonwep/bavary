import {ConditionalStatement} from '../../ast/types';
import {evalBinaryExpression} from '../tools/eval-binary-expression';
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
    const parseConditinalStatement = require('./conditional-statement');
    const parseGroup = require('./group');
    const {condition, consequent, alternate} = decl;
    const conditionValue = evalBinaryExpression(result, condition);

    // Choose branch and take into account that the user may negate the value
    const branch = conditionValue ? consequent : alternate;

    // Branch not declared, that's fine
    if (!branch) {
        return true;
    }

    // Try to match branch
    const res = (
        branch.type === 'group' ?
            parseGroup : parseConditinalStatement
    )({
        config,
        stream,
        scope,
        result,
        decl: branch
    });

    return res !== null && res !== false;
};
