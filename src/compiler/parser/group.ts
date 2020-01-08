import {Group}                    from '../../ast/types';
import {evalDeclaration}          from '../internal';
import {createParsingResult}      from '../tools/create-parsing-result';
import {ParsingResultObjectValue} from '../types';
import {maybeMultiplier}          from './multiplier';

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

    const decs = decl.value;
    for (let i = 0; i < decs.length; i++) {
        const decl = decs[i];

        // Parse declaration
        if (!evalDeclaration({config, stream, decl, scope, result})) {
            stream.pop();
            return null;
        }
    }

    stream.recycle();
    return result.value;
});
