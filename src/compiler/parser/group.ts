import {Group}                                                                                  from '../../ast/types';
import {evalDeclaration}                                                                        from '../internal';
import {createParsingResult}                                                                    from '../tools/create-parsing-result';
import {serializeParsingResult}                                                                 from '../tools/serialize';
import {LocationDataObject, ParserArgs, ParsingResult, ParsingResultObject, ParsingResultValue} from '../types';
import {multiplier}                                                                             from './multiplier';

export const evalGroup = (
    args: Omit<ParserArgs<Group>, 'result'> & {
        result?: ParsingResult;
    }
): ParsingResultValue => {

    return multiplier<ParsingResultValue, Group>(({stream, decl,}) => {
        stream.stash();

        const {
            result = createParsingResult(args.decl.mode || 'string'),
            config,
            scope
        } = args as ParserArgs<Group>;

        // In case the current values is a string
        const previousValue = result.type !== 'object' ? result.value : null;

        // Remember stream-position in case the locationData-option is set
        const starts = stream.index;

        const decs = decl.value;
        for (let i = 0; i < decs.length; i++) {
            const decl = decs[i];

            // Parse declaration
            if (!evalDeclaration({config, stream, decl, scope, result})) {

                // Nullish values used in this group
                if (previousValue === null) {
                    serializeParsingResult(decs, result as ParsingResultObject, true);
                } else  {

                    // Restore initial value
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
            result.value[end] = stream.index;
        }

        stream.recycle();
        return result.value;
    })(args as ParserArgs<Group>);
};
