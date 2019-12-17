import {ConditionalStatement} from '../../ast/types';
import {lookupValue}          from '../tools/lookup-value';
import {ParserArgs}           from '../types';


const isNullOrUndefined = (v: unknown): boolean => v === null || v === undefined;

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
    const [tag, accessor] = condition;
    const tagValue = result.obj[tag.value];

    // Check condition based on whenever the value is not falsy
    const evaluatedCondition = tagValue && (
        !accessor ||  // There's also no deep-accessor attached to it
        !isNullOrUndefined(lookupValue(tagValue, accessor)) // Deep accessor present but points to nothing
    );

    // Choose branch and take into account that the user may negate the value
    const branch = !evaluatedCondition === negated ? then : alternative;

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
