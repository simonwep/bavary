import {Str}        from '../../ast/types';
import {ParserArgs} from '../types';

export const evalString = (
    {stream, decl, result}: ParserArgs<Str>
): boolean => {
    const {value} = decl;

    stream.stash();
    for (let i = 0; i < value.length; i++) {
        const next = stream.next();

        // Check for type mismatch
        if (next !== value[i]) {
            stream.pop();
            return false;
        }
    }

    stream.recycle();
    result.str += value;
    return true;
};
