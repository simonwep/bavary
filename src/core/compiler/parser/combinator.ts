import {GroupedCombinator}                    from '../../ast/types';
import {Streamable}                           from '../../stream';
import {serializeParsingResult}               from '../tools/serialize';
import {CompilerConfig, ParsingResult, Scope} from '../types';

module.exports = (
    config: CompilerConfig,
    stream: Streamable<string>,
    decl: GroupedCombinator,
    scope: Scope,
    result: ParsingResult
): boolean => {
    const declaration = require('./declaration');
    stream.stash();

    switch (decl.sign) {
        case '|': {

            // Match one of the items
            const decs = decl.value;
            for (let i = 0; i < decs.length; i++) {
                if (declaration(config, stream, decs[i], scope, result)) {
                    stream.recycle();

                    // Serialize remaining types
                    serializeParsingResult(decs.slice(i), result.obj);
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
                if (declaration(config, stream, cpy[i], scope, result)) {
                    cpy.splice(i, 1);
                    i = -1;
                }
            }

            // Serialize remaining types
            serializeParsingResult(cpy, result.obj);

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
