import {Group}                                                                                                from '../../ast/types';
import {evalDeclaration}                                                                                      from '../internal';
import {createParsingResult}                                                                                  from '../tools/create-parsing-result';
import {lookupValue}                                                                                          from '../tools/lookup-value';
import {serializeParsingResult}                                                                               from '../tools/serialize';
import {GroupOutcome, LocationDataObject, ParserArgs, ParsingResult, ParsingResultObject, ParsingResultValue} from '../types';
import {maybeMultiplier}                                                                                      from './multiplier';
import {StatementOutcome}                                                                                     from './statement-outcome';

type OptionalResult<T> = {
    [P in Exclude<keyof ParserArgs<T>, 'result'>]: ParserArgs<T>[P];
} & {
    result?: ParsingResult;
}

export const evalGroup = (
    {
        config,
        stream,
        decl,
        scope,
        result = createParsingResult(decl.mode || 'string')
    }: OptionalResult<Group>
): GroupOutcome => {
    stream.stash();

    let state: StatementOutcome = StatementOutcome.OK;
    let value: ParsingResultValue = null;

    maybeMultiplier<ParsingResultValue, Group>(() => {

        // Remember stream-position in case the locationData-option is set
        const starts = stream.index;

        // Remember initial string and array values in case the match fails
        const previousValue = result.type !== 'object' ? result.value : null;

        const decs = decl.value;
        for (let i = 0; i < decs.length; i++) {
            const decl = decs[i];
            const otc = evalDeclaration({config, stream, decl, scope, result: result});

            switch (otc) {
                case StatementOutcome.FAILED: {

                    // Nullish values used in this group
                    if (previousValue === null) {
                        serializeParsingResult(decs, result as ParsingResultObject, true);
                    } else {

                        // Restore initial value
                        result.value = previousValue;
                    }

                    stream.pop();
                    return null;
                }
                case StatementOutcome.RETURN: {

                    // Check if it's a return-statement
                    if (decl.type === 'return' && result?.type === 'object') {
                        state = StatementOutcome.RETURN;
                        value = lookupValue(result.value, decl.value.value) as ParsingResultValue;
                    } else {
                        console.log('wtf');
                    }
                }
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
    })({result, stream, decl, scope, config});

    return {
        value,
        state
    };
};
