import {Group}                    from '../../ast/types';
import {serializeParsingResult}   from '../tools/serialize';
import {ParsingResultObjectValue} from '../types';
import {maybeMultiplier}          from './multiplier';

module.exports = maybeMultiplier<ParsingResultObjectValue, Group>((
    {
        config,
        stream,
        decl,
        scope,
        result = {
            obj: {},
            str: '',
            pure: true
        }
    }
): ParsingResultObjectValue => {
    const declaration = require('./declaration');
    stream.stash();

    // Remember current raw result in case the group fails
    const previousRawString = result.str;

    const decs = decl.value;
    for (let i = 0; i < decs.length; i++) {
        const decl = decs[i];

        // Parse declaration
        if (!declaration({config, stream, decl, scope, result})) {
            stream.pop();

            // Serialize remaining types
            serializeParsingResult(decs, result.obj, true);

            // Restore previous state
            result.str = previousRawString;
            return null;
        }
    }

    // TODO: Serialization dosn't work properly
    // Serialize remaining types
    serializeParsingResult(decs, result.obj, false);

    stream.recycle();
    return result.pure ? result.str : result.obj;
});
