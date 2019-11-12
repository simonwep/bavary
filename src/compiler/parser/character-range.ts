import {CharacterRange} from '../../ast/types';
import Streamable       from '../../stream';
import {ParsingResult}  from '../types';

/**
 * Parses a character-range
 * @param stream Character-stream
 * @param decl
 * @param result
 * @returns {null|*}
 */
module.exports = (stream: Streamable<string>, decl: CharacterRange, result: ParsingResult): boolean => {
    const {from, to} = decl.value;

    if (!stream.hasNext()) {
        return false;
    }

    // Resolve next character / char-code
    const value = stream.next() as string;
    const charCode = value.charCodeAt(0);

    // Check if charcode matches given range
    if (charCode >= from && charCode <= to) {
        result.str += value;
        return true;
    }

    return false;
};
