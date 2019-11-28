import {Group}                                   from '../../ast/types';
import {serializeParsingResult}                  from '../tools/serialize';
import {ParsingResult, ParsingResultObjectValue} from '../types';
import {maybeMultiplier}                         from './multiplier';

module.exports = maybeMultiplier<ParsingResultObjectValue, Group>((
    config,
    stream,
    decl,
    scope,
    result: ParsingResult = {
        obj: {},
        str: '',
        pure: true
    }
): ParsingResultObjectValue => {
    const declaration = require('./declaration');
    stream.stash();

    // Remember current raw result in case the group fails
    const previousRawString = result.str;

    const decs = decl.value;
    for (let i = 0; i < decs.length; i++) {
        const dec = decs[i];

        // Parse declaration
        if (!declaration(config, stream, dec, scope, result)) {
            stream.pop();

            // Serialize remaining types
            serializeParsingResult(decs, result.obj, true);

            // Restore previous state
            result.str = previousRawString;
            return null;
        }
    }

    stream.recycle();
    return result.pure ? result.str : result.obj;
});
