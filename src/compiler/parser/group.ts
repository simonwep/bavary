import {Group}                                                             from '../../ast/types';
import {evalDeclaration}                                                   from '../internal';
import {createParsingResult}                                               from '../tools/create-parsing-result';
import {serializeParsingResult}                                            from '../tools/serialize';
import {LocationDataObject, ParsingResultObject, ParsingResultObjectValue} from '../types';
import {maybeMultiplier}                                                   from './multiplier';

export const evalGroup = maybeMultiplier<ParsingResultObjectValue, Group>((
    {
        config,
        stream,
        decl,
        scope,
        result = createParsingResult(decl.mode)
    }
): ParsingResultObjectValue => {
    stream.stash();

    // Remember stream-position in case the locationData-option is set
    const starts = stream.index;

    // Remember initial string and array values in case the match fails
    const previousValue = result.type !== 'object' ? result.value : null;

    // TODO: Serialization
    const decs = decl.value;
    for (let i = 0; i < decs.length; i++) {
        const decl = decs[i];

        // Parse declaration
        if (!evalDeclaration({config, stream, decl, scope, result})) {

            // Nullish values used in this group
            if (previousValue === null) {
                serializeParsingResult(decs, result as ParsingResultObject, true);
            } else {

                // Restore initial value
                // TODO: The !.-thang is ugly
                result.value = previousValue;
            }

            stream.pop();
            return null;
        }
    }

    // Nullish remaining values
    if (previousValue === null) {
        serializeParsingResult(decs, result as ParsingResultObject);
    }

    // Add location-data if enabled
    // Save optional start / end labels
    if (config.locationData && result.type === 'object') {
        const {end, start} = config.locationData as LocationDataObject;
        result.value[start] = starts;
        result.value[end] = stream.index - 1;
    }

    stream.recycle();
    return result.value;
});
