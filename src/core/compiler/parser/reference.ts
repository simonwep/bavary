import {Reference}                                      from '../../ast/types';
import Streamable                                       from '../../stream';
import {resolveReference}                               from '../tools/resolve-scope';
import {ParsingResult, ParsingResultObjectValue, Scope} from '../types';
import multiplier                                       from './multiplier';

module.exports = (stream: Streamable<string>, decl: Reference, scope: Scope, result: ParsingResult): boolean => {
    const group = require('./group');

    // Resolve reference
    const resolvedScope = resolveReference(scope, decl);

    if (!resolvedScope) {
        throw new Error(`Failed to resolve "${decl.value.join(':')}".`);
    }

    // Parse
    stream.stash();

    // Resolve-scope returns a new sub-scope for the target and the target itself
    const [newScope, targetBody] = resolvedScope;

    // Type may have a multiplier attached to it
    const matches = multiplier<ParsingResultObjectValue, Reference>(
        () => group(stream, targetBody, newScope)
    )(stream, decl, newScope, result);

    // Identify result type
    const isArray = Array.isArray(matches);
    const isString = typeof matches === 'string';
    const isObject = !isArray && !isString;

    // If reference has a tag immediatly attach result
    if (decl.tag) {
        result.obj[decl.tag] = matches;
    }

    if (matches) {

        // Join extensions
        if (decl.extensions) {
            if (isArray || isString) {
                throw new Error('Extensions can only be used on types which return an object.');
            }

            Object.assign(matches as object, decl.extensions);
        }

        if (decl.pipeInto) {
            const pipeTarget = decl.pipeInto;
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
