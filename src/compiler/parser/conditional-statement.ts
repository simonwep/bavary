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
    const {condition, then, alternative} = decl;
    const [tag, accessor] = condition;
    const tagValue = result.obj[tag.value];

    // Check condition based on whenever the value is not falsy
    const branch = tagValue && (
        !accessor ||
        !isNullOrUndefined(lookupValue(tagValue, accessor))
    ) ? then :
        alternative;

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
