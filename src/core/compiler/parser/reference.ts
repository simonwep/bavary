import {ModifierTarget, Reference}                                      from '../../ast/types';
import {Streamable}                                                     from '../../stream';
import {resolveReference}                                               from '../tools/resolve-scope';
import {CompilerConfig, ParsingResult, ParsingResultObjectValue, Scope} from '../types';
import {applyModifications}                                             from './modification';
import {maybeMultiplier}                                                from './multiplier';

module.exports = (
    config: CompilerConfig,
    stream: Streamable<string>,
    decl: Reference,
    scope: Scope,
    result: ParsingResult
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
    const matches = maybeMultiplier<ParsingResultObjectValue, Reference>(
        () => group(config, stream, targetBody, newScope)
    )(config, stream, decl, newScope, result);

    // Identify result type
    const isArray = Array.isArray(matches);
    const isString = typeof matches === 'string';
    const isObject = !isArray && !isString;

    // If reference has a tag, immediatly attach result
    if (decl.tag) {
        result.obj[decl.tag] = matches;
    }

    if (matches) {

        // Apply modifiers if defined
        if (decl.modifiers) {
            applyModifications(matches as ModifierTarget, decl);
        }

        if (decl.join) {
            const pipeTarget = decl.join;
            const target = result.obj[pipeTarget];

            if (!target) {
                throw new Error(`Cannot pipe result into "${pipeTarget}". It isn't defined yet or cannot be found.`);
            }

            // TODO: That's a mess, clean it up
            if (Array.isArray(target)) {
                if (isArray) {
                    target.push(...(matches as Array<ParsingResultObjectValue>));
                } else {
                    throw new Error(`Cannot pipe result into "${pipeTarget}" since the target isn't an array.`);
                }
            } else if (typeof target === 'object') {
                if (isObject) {
                    Object.assign(target, matches);
                } else {
                    throw new Error(`Cannot pipe result into "${pipeTarget}" since the target isn't an object.`);
                }
            } else if (isString) {
                (result.obj[pipeTarget] as string) += matches;
            } else {
                throw new Error(`Cannot pipe result into "${pipeTarget}" since the target isn't a string.`);
            }
        } else if (decl.spread) {

            // Spread operator won't work with strings or arrays
            if (!isObject) {
                throw new Error(`"${decl.value}" doesn't return a object which is required for the spread operator to work.`);
            }

            // Assign result to current object
            Object.assign(result.obj, matches);
            result.pure = false;
        } else if (decl.tag) {

            // Since something was matched the result is not anymore "just a string"
            result.pure = false;

            // Perform appropriate action
        } else if (isArray && (matches as Array<unknown>).every(v => typeof v === 'string')) {
            result.str += (matches as Array<unknown>).join(''); // Concat string sequences
        } else if (isString) {
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
