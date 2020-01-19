import {Group}                                                             from '../../ast/types';
import {evalDeclaration}                                                   from '../internal';
import {createParsingResult}                                               from '../tools/create-parsing-result';
import {serializeParsingResult}                                            from '../tools/serialize';
import {LocationDataObject, ParserArgs, ParsingResult, ParsingResultValue} from '../types';
import {multiplier}                                                        from './multiplier';

export const evalGroup = (
    args: Omit<ParserArgs<Group>, 'result'> & {
        result?: ParsingResult;
    }
): ParsingResultValue => {

    // Non-changing props used in multiplier
    const {config, scope} = args;

    return multiplier<ParsingResultValue, Group>(({stream, decl}) => {
        stream.stash();

        // Use passed result, create new out of the current mode or string as default
        const result = (args as ParserArgs<Group>).result ||
            createParsingResult(args.decl.mode || 'string');

        // In case the evaluation fails and the value needs to get be restored
        const previousValue = result.value;

        // Remember stream-position in case the locationData-option is set
        const starts = stream.index;

        const decs = decl.value;
        for (let i = 0; i < decs.length; i++) {
            const decl = decs[i];

            // Parse declaration
            if (!evalDeclaration({config, stream, decl, scope, result})) {

                if (result.type === 'object') {

                    // Nullish properties used in this group
                    serializeParsingResult(decs, result, true);
                } else {

                    // Restore previous value
                    result.value = previousValue as string | Array<ParsingResultValue>;
                }

                stream.pop();
                return null;
            }
        }

        // Nullish remaining values
        if (result.type === 'object') {
            serializeParsingResult(decs, result);
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
