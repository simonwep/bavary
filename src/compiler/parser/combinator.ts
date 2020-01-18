import {Combinator}      from '../../ast/types';
import {evalDeclaration} from '../internal';
import {ParserArgs}       from '../types';

export const evalCombiantor = (
    {
        config,
        stream,
        decl,
        scope,
        result
    }: ParserArgs<Combinator>
): boolean => {
    stream.stash();

    switch (decl.sign) {
        case '|': {

            // Match one of the items
            const decs = decl.value;
            for (let i = 0; i < decs.length; i++) {
                if (evalDeclaration({config, stream, decl: decs[i], scope, result})) {
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
                if (evalDeclaration({config, stream, decl: cpy[i], scope, result})) {
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
