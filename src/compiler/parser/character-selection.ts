import {CharacterSelection, CharacterSelectionArray} from '../../ast/types';
import Streamable                                    from '../../stream';
import {ParsingResult, Scope}                        from '../types';
import multiplier                                    from './multiplier';

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
 * @param scope
 * @param result
 * @returns {null|*}
 */
module.exports = (stream: Streamable<string>, decl: CharacterSelection, scope: Scope, result: ParsingResult): boolean => {
    const {included, excluded} = decl;

    // Type may have a multiplier attached to it
    const matches = multiplier<string>(() => {

        if (stream.hasNext()) {

            // Resolve next character / char-code
            const value = stream.peek() as string;
            const charCode = value.charCodeAt(0);

            // Check if character is included and not excluded
            if (matchesCharacterSelectionArray(included, charCode) &&
                !matchesCharacterSelectionArray(excluded, charCode)) {
                stream.next();
                return value;
            }
        }

        return null;
    })(stream, decl, scope, result);

    // Resolve corresponding multiplier
    if (Array.isArray(matches)) {
        result.str += (matches).join('');
    } else if (typeof matches === 'string') {
        result.str += matches;
    } else if (!matches && !decl.multiplier || (decl.multiplier && decl.multiplier.type !== 'optional')) {
        return false;
    }

    return true;
};
