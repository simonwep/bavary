import {Declaration, Reference}               from '../../ast/types';
import {resolveReference}                     from '../tools/resolve-scope';
import {ParserArgs, ParsingResultObjectValue} from '../types';
import {maybeMultiplier}                      from './multiplier';

module.exports = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Reference>
): ParsingResultObjectValue => {
    const group = require('./group');

    // Resolve reference
    const res = resolveReference(scope, decl);

    if (!res) {
        throw new Error(`Failed to resolve "${decl.value.join(':')}".`);
    }

    const [newScope, target] = res;
    const typeArguments = target.arguments;
    const refArguments = decl.arguments;

    // Check if target expects arguments
    if (typeArguments) {

        // Validate arguments and use default in case none were provided
        for (const {value, name} of typeArguments) {

            // Lookup value in arguments, use default as fallback
            // TODO: What about redundant arguments
            const argVal = refArguments?.find(v => v.name === name)?.value || value;

            // Neither does the target argument have a default-value or something was passed into it
            if (!argVal) {
                throw new Error(`Argument "${name}" is missing default value.`);
            }

            // TODO: Check if scope already contains this type
            // TODO: Looks shitty
            newScope.entries.set(name, {
                type: 'value',
                value: {
                    type: 'declaration',
                    arguments: null,
                    variant: null,
                    name,
                    value: argVal
                } as Declaration
            });
        }
    } else if (refArguments) {
        throw new Error(`Type "${target.name}" does not expect any arguments.`);
    }

    // Type may have a multiplier attached to it
    return maybeMultiplier<ParsingResultObjectValue, Reference>(
        () => group({
            config,
            stream,
            decl: target.value,
            scope: newScope
        })
    )({
        config, stream, decl, result,
        scope: newScope
    });
};
