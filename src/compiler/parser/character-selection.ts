import {CharacterSelection, CharacterSelectionArray} from '../../ast/types';
import {ParserArgs}                                  from '../types';
import {maybeMultiplier}                             from './multiplier';
import {StatementOutcome}                            from './statement-outcome';

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
): StatementOutcome => {
    const {included, excluded} = decl;

    // Type may have a multiplier attached to it
    const matches = maybeMultiplier<string, CharacterSelection>(() => {

        if (stream.hasNext()) {

            // Resolve next character / char-code
            const value = stream.peek() as string;
            const charCode = value.charCodeAt(0);

            // Check if character is included and not excluded
            if (
                matchesCharacterSelectionArray(included, charCode) &&
                !matchesCharacterSelectionArray(excluded, charCode)) {
                stream.next();
                return value;
            }
        }

        return null;
    })({config, stream, decl, scope, result});

    if (matches) {

        // Ignore result if current mode is not a string
        if (result.type === 'string') {

            // Append value, concat array values if needed
            result.value += Array.isArray(matches) ? matches.join('') : matches;
        }
    } else if (decl.multiplier?.type !== 'optional') {
        return StatementOutcome.FAILED;
    }

    return StatementOutcome.OK;
};
