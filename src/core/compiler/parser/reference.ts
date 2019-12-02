import {ModifierTarget, Reference}                                from '../../ast/types';
import {typeOf}                                                   from '../../misc/type-of';
import {resolveReference}                                         from '../tools/resolve-scope';
import {LocationDataObject, ParserArgs, ParsingResultObjectValue} from '../types';
import {applyModifications}                                       from './modification';
import {maybeMultiplier}                                          from './multiplier';

module.exports = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Reference>
): boolean => {
    const group = require('./group');
    stream.stash();

    // Resolve reference
    const res = resolveReference(scope, decl);

    if (!res) {
        throw new Error(`Failed to resolve "${decl.value.join(':')}".`);
    }

    const [newScope, targetBody] = res;

    // Type may have a multiplier attached to it
    const starts = stream.index;
    const matches = maybeMultiplier<ParsingResultObjectValue, Reference>(
        () => group({
            config,
            stream,
            decl: targetBody,
            scope: newScope
        })
    )({
        config, stream, decl, result,
        scope: newScope
    });

    // Identify result type
    const matchesType = typeOf(matches);

    // If reference has a tag, immediatly attach result
    if (decl.tag) {
        result.obj[decl.tag] = matches;
    }

    if (matches) {

        // Apply modifiers if defined
        if (decl.modifiers) {
            applyModifications( matches as ModifierTarget, decl);
        }

        // Save optional start / end labels
        if (config.locationData && matchesType === 'object') {
            const {end, start} = config.locationData as LocationDataObject;
            (matches as ModifierTarget)[start] = starts;
            (matches as ModifierTarget)[end] = stream.index - 1;
        }

        /* istanbul ignore if: Parts of it require changes made via custom-functions */
        if (decl.join) {
            const pipeTarget = decl.join;
            const target = result.obj[pipeTarget];
            const targetType = typeOf(target);

            if (!target) {
                throw new Error(`"${pipeTarget}" isn't defined yet or cannot be found.`);
            } else if (targetType !== matchesType) {
                throw new Error(`Cannot join because the type of source and target aren't identical. ${matchesType} ≠ ${targetType}.`);
            }

            if (targetType === 'array') {
                (target as Array<unknown>).push(...(matches as Array<ParsingResultObjectValue>));
            } else if (targetType === 'object') {
                Object.assign(target, matches);
            } else if (targetType === 'string') {

                // User may modify it via custom-function
                (result.obj[pipeTarget] as string) += matches;
            } else {
                throw new Error(`Invalid target type: ${targetType}`);
            }
        } else if (decl.spread) {

            // Spread operator won't work with strings or arrays
            if (matchesType !== 'object') {
                throw new Error(`"${decl.value}" doesn't return a object which is required for the spread operator to work.`);
            }

            // Assign result to current object
            Object.assign(result.obj, matches);
            result.pure = false;
        } else if (decl.tag) {

            // Since something was matched the result is not anymore "just a string"
            result.pure = false;

            // Perform appropriate action
        } else if (matchesType === 'array' && (matches as Array<unknown>).every(v => typeof v === 'string')) {
            result.str += (matches as Array<unknown>).join(''); // Concat string sequences
        } else if (matchesType === 'string') {
            result.str += matches as string;
        } else {
            throw new Error(`Type "${decl.value}" is missing a tag.`);
        }
    } else {

        // Restore previous stack position
        stream.pop();

        // Declaration may be still optional through a '?'
        return !!(decl.multiplier && decl.multiplier.type === 'optional');
    }

    stream.recycle();
    return true;
};
