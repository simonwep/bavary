import {Type}                                           from '../../ast/types';
import Streamable                                       from '../../stream';
import {ParsingResult, ParsingResultObjectValue, Scope} from '../types';
import multiplier                                       from './multiplier';

module.exports = (stream: Streamable<string>, decl: Type, scope: Scope, result: ParsingResult): boolean => {
    const typeValue = require('./type-value');
    const {value} = decl;

    // Lookup parser
    if (!scope.has(value)) {
        throw new Error(`Cannot resolve "${value}"`);
    }

    // Parse
    stream.stash();
    const body = scope.get(value);

    // Type may have a multiplier attached to it
    const matches = multiplier<ParsingResultObjectValue>(
        () => typeValue(stream, body, scope)
    )(stream, decl, scope, result);

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
