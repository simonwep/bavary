import {BinaryCombinator}       from '../../ast/types';
import {serializeParsingResult} from '../tools/serialize';
import {ParserArgs}             from '../types';

module.exports = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<BinaryCombinator>
): boolean => {
    const declaration = require('./declaration');
    stream.stash();

    // Serialize remaining types
    serializeParsingResult(decl.value, result);

    switch (decl.sign) {
        case '|': {

            // Match one of the items
            const decs = decl.value;
            for (let i = 0; i < decs.length; i++) {
                if (declaration({config, stream, decl: decs[i], scope, result})) {
                    stream.recycle();
                    return true;
                }
            }

            break;
        }
        case '&&':
        case '&': {
            const cpy = [...decl.value];

            // Match items ignoring the order
            for (let i = 0; i < cpy.length; i++) {
                if (declaration({config, stream, decl: cpy[i], scope, result})) {
                    cpy.splice(i, 1);
                    i = -1;
                }
            }

            if (!cpy.length || (decl.sign === '&&' && cpy.length < decl.value.length)) {
                stream.recycle();
                return true;
            }

            break;
        }
    }

    stream.pop();
    return false;
};
