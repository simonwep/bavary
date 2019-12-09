import {Reference}                            from '../../ast/types';
import {injectDeclaration, resolveReference}  from '../tools/scope-utils';
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

            injectDeclaration(newScope, name, argVal);
        }

        if (refArguments.length) {
            throw new Error(`These arguments were passed into "${target.name}" but not expected: ${refArguments.map(v => v.name).join(', ')}`);
        }
    } else if (refArguments.length) {
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
