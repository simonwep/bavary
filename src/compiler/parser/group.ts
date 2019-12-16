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
    const parseDeclaration = require('./declaration');
    stream.stash();

    // Remember current raw result in case the group fails
    const previousRawString = result.str;

    const decs = decl.value;
    for (let i = 0; i < decs.length; i++) {
        const decl = decs[i];

        // Parse declaration
        if (!parseDeclaration({config, stream, decl, scope, result})) {
            stream.pop();

            // Set all tages used within this declaration to null
            serializeParsingResult(decs, result, true);

            // Restore previous state
            result.str = previousRawString;
            return null;
        }
    }

    // Serialize remaining types
    serializeParsingResult(decs, result);

    stream.recycle();
    return result.pure ? result.str : result.obj;
});
