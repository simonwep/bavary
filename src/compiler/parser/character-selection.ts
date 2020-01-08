import {CharacterSelection, CharacterSelectionArray} from '../../ast/types';
import {ParserArgs}                                  from '../types';
import {maybeMultiplier}                             from './multiplier';

/**
 * Checks if any range or value of a CharacterSelectionArray matches the given char-code
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
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<CharacterSelection>
): boolean => {
    const {included, excluded} = decl;

    // Type may have a multiplier attached to it
    const matches = maybeMultiplier<string, CharacterSelection>(() => {

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
    })({config, stream, decl, scope, result});

    // Resolve corresponding multiplier
    if (Array.isArray(matches)) {
        const strValue = (matches).join('');


        if (result.type === 'string') {
            result.value += strValue;
        } else if (result.type === 'array') {
            result.value.push(strValue);
        }

    } else if (typeof matches === 'string') {

        if (result.type === 'string') {
            result.value += matches;
        } else if (result.type === 'array') {
            result.value.push(matches);
        }

    } else if (!matches && !decl.multiplier || (decl.multiplier && decl.multiplier.type !== 'optional')) {
        return false;
    }

    return true;
};
