import {CharacterSelection, CharacterSelectionArray} from '../../ast/types';
import Streamable                                    from '../../stream';
import {ParsingResult}                               from '../types';

/**
 * Checks if any range or value of a CharacterSelectionArray matches the given char-code
 * @param arr
 * @param charCode
 */
const matchesCharacterSelectionArray = (arr: CharacterSelectionArray, charCode: number): boolean => {
    return arr.some(
        v => v.type === 'character' ? v.value === charCode :
            charCode >= v.from && charCode <= v.to
    );
};

/**
 * Parses a character-selection
 * @param stream Character-stream
 * @param decl
 * @param result
 * @returns {null|*}
 */
module.exports = (stream: Streamable<string>, decl: CharacterSelection, result: ParsingResult): boolean => {
    const {included, excluded} = decl;

    if (!stream.hasNext()) {
        return false;
    }

    // Resolve next character / char-code
    const value = stream.next() as string;
    const charCode = value.charCodeAt(0);

    // Check if character isn't included or is excluded
    if (!matchesCharacterSelectionArray(included, charCode) ||
        matchesCharacterSelectionArray(excluded, charCode)) {
        return false;
    }

    result.str += value;
    return true;
};
