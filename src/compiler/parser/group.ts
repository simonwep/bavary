import {Group}                                         from '../../ast/types';
import {evalDeclaration}                               from '../internal';
import {createParsingResult}                           from '../tools/create-parsing-result';
import {serializeParsingResult}                        from '../tools/serialize';
import {ParsingResultObject, ParsingResultObjectValue} from '../types';
import {maybeMultiplier}                               from './multiplier';

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

    // TODO: Serialization
    const decs = decl.value;
    const isObject = result.type === 'object';
    for (let i = 0; i < decs.length; i++) {
        const decl = decs[i];

        // Parse declaration
        if (!evalDeclaration({config, stream, decl, scope, result})) {

            // Nullish values used in this group
            if (isObject) {
                serializeParsingResult(decs, result as ParsingResultObject, true);
            }

            stream.pop();
            return null;
        }
    }

    // Nullish remaining values
    if (isObject) {
        serializeParsingResult(decs, result as ParsingResultObject);
    }

    stream.recycle();
    return result.value;
});
