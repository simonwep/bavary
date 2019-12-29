import {Group, ModifierTarget, Reference}     from '../../ast/types';
import {evalGroup, evalModification}          from '../internal';
import {ParserArgs, ParsingResultObjectValue} from '../types';
import {maybeMultiplier}                      from './multiplier';

export const evalRawReference = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Reference>
): ParsingResultObjectValue => {

    // Resolve reference
    const res = scope.lookupByPath(decl.value);

    if (!res) {
        throw new Error(`Failed to resolve "${decl.value.join(':')}". If it's a block a default export may be missing.`);
    }

    const [target, newScope] = res;
    const typeArguments = target.arguments;
    const refArguments = [...(decl.arguments || [])];

    // Check if target expects arguments
    if (typeArguments) {

        // Validate arguments and use default in case none were provided
        for (const {value, name} of typeArguments) {

            // Lookup value in arguments, use default as fallback
            let argVal = value;
            const targetIndex = refArguments.findIndex(v => v.name === name);

            if (~targetIndex) {
                ([{value: argVal}] = refArguments.splice(targetIndex, 1));
            }

            // Neither does the target argument have a default-value or something was passed into it
            if (!argVal) {
                throw new Error(`Argument "${name}" is missing on type ${target.name}.`);
            }

            newScope.injectValue(argVal, name);
        }

        if (refArguments.length) {
            throw new Error(`These arguments were passed into "${target.name}" but not expected: ${refArguments.map(v => v.name).join(', ')}`);
        }
    } else if (refArguments.length) {
        throw new Error(`Type "${target.name}" does not expect any arguments.`);
    }

    // Type may have a multiplier attached to it
    const matches = maybeMultiplier<ParsingResultObjectValue, Reference>(
        () => evalGroup({
            config,
            stream,
            decl: target.value as Group,
            scope: newScope
        })
    )({
        config, stream, decl, result,
        scope: newScope
    });

    // Apply modifiers if defined
    if (matches && decl.modifiers) {
        evalModification(matches as ModifierTarget, decl);
    }

    return matches;
};
