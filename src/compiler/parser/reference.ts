import {Reference}                                      from '../../ast/types';
import Streamable                                       from '../../stream';
import {resolveReference}                               from '../tools/resolve-scope';
import {ParsingResult, ParsingResultObjectValue, Scope} from '../types';
import multiplier                                       from './multiplier';

module.exports = (stream: Streamable<string>, decl: Reference, scope: Scope, result: ParsingResult): boolean => {
    const typeValue = require('./type-value');

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
    const matches = multiplier<ParsingResultObjectValue>(
        () => typeValue(stream, targetBody, newScope)
    )(stream, decl, newScope, result);

    // Tags can be nullish
    if (decl.tag) {
        result.obj[decl.tag] = matches; // Save tag-result (can be null)

        if (matches) {

            // Since something was matched the result is not anymore "just a string"
            result.pure = false;
        }
    }

    if (!matches) {

        // Restore previous stack position
        stream.pop();

        // Declaration may be still optional through a '?'
        return !!(decl.multiplier && decl.multiplier.type === 'optional');
    }

    if (!decl.tag) {
        if (Array.isArray(matches) && matches.every(v => typeof v === 'string')) {
            result.str += matches.join(''); // Concat string sequences
        } else if (typeof matches === 'string') {
            result.str += matches;
        } else {
            throw new Error(`Type "${decl.value}" is missing a tag.`);
        }
    }

    stream.recycle();
    return true;
};
