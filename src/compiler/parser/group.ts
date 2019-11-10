import {Group}                                   from '../../ast/types';
import serialize                                 from '../tools/serialize';
import {ParsingResult, ParsingResultObjectValue} from '../types';
import multiplier                                from './multiplier';

module.exports = multiplier<ParsingResultObjectValue>((stream, decl, scope, result: ParsingResult = {
    obj: {},
    str: '',
    pure: true
}): ParsingResultObjectValue => {
    const declaration = require('./declaration');
    stream.stash();

    // Remember current raw result in case the group fails
    const previousRawString = result.str;

    const decs = (decl as Group).value;
    for (let i = 0; i < decs.length; i++) {
        const dec = decs[i];

        // Parse declaration
        if (!declaration(stream, dec, scope, result)) {
            stream.pop();

            // Serialize remaining types
            serialize(decs, result.obj, true);

            // Restore previous state
            result.str = previousRawString;
            return null;
        }
    }

    stream.recycle();
    return result.pure ? result.str : result.obj;
});