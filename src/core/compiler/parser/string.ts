import {Str}           from '../../ast/types';
import {Streamable}    from '../../stream';
import {ParsingResult} from '../types';

/**
 * Parses a single string
 * @param stream Character-stream
 * @param decl
 * @param result
 * @returns {null|*}
 */
module.exports = (stream: Streamable<string>, decl: Str, result: ParsingResult): boolean => {
    const {value} = decl;

    stream.stash();
    for (let i = 0; i < value.length; i++) {
        const next = stream.next();

        // Check for type mismatch
        if (next !== value[i]) {
            stream.pop();
            return false;
        }
    }

    stream.recycle();
    result.str += value;
    return true;
};
