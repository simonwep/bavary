import {CharacterSelection, CharacterSelectionArray} from '../../ast/types';
import {StringNode}                                  from '../node';
import {ParserArgs}                                  from '../types';
import {multiplier}                                  from './multiplier';

/**
 * Checks if any range or node of a CharacterSelectionArray matches the given char-code
 * @param arr
 * @param charCode
 */
const matchesCharacterSelectionArray = (arr: CharacterSelectionArray, charCode: number): boolean => {
    return arr.some(
        v => typeof v === 'number' ?
            v === charCode :
            charCode >= v[0] && charCode <= v[1]
    );
};

export const evalCharacterSelection = (
    {
        stream,
        decl,
        node
    }: ParserArgs<CharacterSelection>
): boolean => {
    const {included, excluded} = decl;

    // Type may have a multiplier attached to it
    const matches = multiplier<string, CharacterSelection>(() => {

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
    })({stream, decl});

    if (matches) {

        // Append value, concat array values if needed
        if (node instanceof StringNode) {
            node.value += Array.isArray(matches) ? matches.join('') : matches;
        }

        // Ignore value if current mode is not a string
        return true;
    } else if (decl.multiplier?.type !== 'optional') {
        return false;
    }

    return true;
};
